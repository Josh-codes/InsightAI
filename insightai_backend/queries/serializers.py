from rest_framework import serializers
from .models import QueryHistory


class QueryHistorySerializer(serializers.ModelSerializer):
    insight_summary = serializers.SerializerMethodField()

    class Meta:
        model = QueryHistory
        fields = [
            'id', 'natural_language', 'generated_sql',
            'chart_type', 'execution_time_ms', 'cached',
            'insight_summary', 'created_at',
        ]

    def get_insight_summary(self, obj):
        return obj.insight[:120] if obj.insight else ''


class QueryResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryHistory
        fields = [
            'id', 'natural_language', 'generated_sql',
            'result_data', 'chart_type', 'insight',
            'execution_time_ms', 'cached', 'created_at',
        ]
