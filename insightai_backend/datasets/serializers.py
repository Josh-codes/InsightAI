from rest_framework import serializers
from .models import Dataset


class DatasetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['id', 'name', 'original_filename', 'row_count', 'file_size_bytes', 'created_at']


class DatasetDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = [
            'id', 'name', 'original_filename', 'table_name',
            'schema', 'row_count', 'file_size_bytes',
            'column_stats', 'preview_data', 'created_at',
        ]
