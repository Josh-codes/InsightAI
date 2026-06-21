from django.conf import settings
from django.db import models


class QueryHistory(models.Model):
    CHART_CHOICES = [('bar', 'bar'), ('line', 'line'), ('table', 'table')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='queries')
    dataset = models.ForeignKey('datasets.Dataset', on_delete=models.CASCADE, related_name='queries')
    natural_language = models.TextField()
    generated_sql = models.TextField(blank=True)
    result_data = models.JSONField(default=list)
    chart_type = models.CharField(max_length=10, choices=CHART_CHOICES, default='table')
    insight = models.TextField(blank=True)
    error = models.TextField(blank=True)
    execution_time_ms = models.IntegerField(default=0)
    cached = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Query #{self.id} on dataset {self.dataset_id}'
