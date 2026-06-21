from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from utils.responses import success_response, error_response
from .models import Dataset
from .serializers import DatasetListSerializer, DatasetDetailSerializer
from .services.file_parser import parse_uploaded_file
from .services.type_inferrer import infer_column_types
from .services.table_manager import create_dataset_table, insert_dataframe, drop_dataset_table
from .services.stats_calculator import calculate_stats, get_preview_rows


class DatasetUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return error_response('No file provided.')

        name = request.data.get('name', file.name)

        try:
            df = parse_uploaded_file(file)
        except ValueError as e:
            return error_response(str(e))

        schema = infer_column_types(df)

        # Save model first to get the auto-generated id
        dataset = Dataset.objects.create(
            user=request.user,
            name=name,
            original_filename=file.name,
            schema=schema,
            row_count=len(df),
            file_size_bytes=file.size,
        )

        table_name = f'user_{request.user.id}_dataset_{dataset.id}'
        dataset.table_name = table_name

        try:
            create_dataset_table(table_name, schema)
            insert_dataframe(table_name, df)
        except Exception as e:
            dataset.delete()
            return error_response(f'Failed to create data table: {str(e)}', status=500)

        dataset.column_stats = calculate_stats(df)
        dataset.preview_data = get_preview_rows(df)
        dataset.save()

        return success_response(DatasetDetailSerializer(dataset).data, status=201)


class DatasetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        datasets = Dataset.objects.filter(user=request.user)
        return success_response(DatasetListSerializer(datasets, many=True).data)


class DatasetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            dataset = Dataset.objects.get(pk=pk, user=request.user)
        except Dataset.DoesNotExist:
            return error_response('Dataset not found.', status=404)
        return success_response(DatasetDetailSerializer(dataset).data)

    def delete(self, request, pk):
        try:
            dataset = Dataset.objects.get(pk=pk, user=request.user)
        except Dataset.DoesNotExist:
            return error_response('Dataset not found.', status=404)

        drop_dataset_table(dataset.table_name)
        dataset.delete()
        return success_response({'message': 'Dataset deleted.'})
