from django.conf import settings
from django.db import models


class Dataset(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='datasets')
    name = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=500)
    table_name = models.CharField(max_length=255, unique=True, blank=True)
    schema = models.JSONField(default=dict)          # {col_name: pg_type}
    row_count = models.IntegerField(default=0)
    file_size_bytes = models.BigIntegerField(default=0)
    column_stats = models.JSONField(default=dict)    # {col: {min, max, mean, null_count}}
    preview_data = models.JSONField(default=list)    # first 5 rows as list of dicts
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} (user {self.user_id})'
