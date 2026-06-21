from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from datasets.models import Dataset
from utils.responses import success_response, error_response
from .models import QueryHistory
from .serializers import QueryResultSerializer, QueryHistorySerializer
from .services.llm_service import generate_sql
from .services.sql_extractor import extract_sql
from .services.sql_validator import validate_sql
from .services.query_executor import execute_query
from .services.chart_detector import detect_chart_type
from .services.insight_generator import generate_insight


class RunQueryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        dataset_id = request.data.get('dataset_id')
        natural_language = request.data.get('natural_language', '').strip()

        if not dataset_id:
            return error_response('dataset_id is required.')
        if not natural_language:
            return error_response('natural_language is required.')

        try:
            dataset = Dataset.objects.get(pk=dataset_id, user=request.user)
        except Dataset.DoesNotExist:
            return error_response('Dataset not found.', status=404)

        try:
            raw_output, from_cache = generate_sql(natural_language, dataset)
            sql = extract_sql(raw_output)
            sql = validate_sql(sql, dataset)
            data, elapsed_ms = execute_query(sql)
        except ValueError as e:
            return error_response(str(e))
        except Exception as e:
            return error_response(f'Query failed: {str(e)}', status=500)

        chart_type = detect_chart_type(data, dataset.schema)

        insight = ''
        if not from_cache:
            try:
                insight = generate_insight(natural_language, sql, data)
            except Exception:
                insight = ''

        record = QueryHistory.objects.create(
            user=request.user,
            dataset=dataset,
            natural_language=natural_language,
            generated_sql=sql,
            result_data=data,
            chart_type=chart_type,
            insight=insight,
            execution_time_ms=elapsed_ms,
            cached=from_cache,
        )

        return success_response(QueryResultSerializer(record).data)


class QueryHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dataset_id = request.query_params.get('dataset_id')
        qs = QueryHistory.objects.filter(user=request.user)
        if dataset_id:
            qs = qs.filter(dataset_id=dataset_id)
        return success_response(QueryHistorySerializer(qs[:50], many=True).data)

    def delete(self, request, pk):
        try:
            record = QueryHistory.objects.get(pk=pk, user=request.user)
        except QueryHistory.DoesNotExist:
            return error_response('Query not found.', status=404)
        record.delete()
        return success_response({'message': 'Query deleted.'})
