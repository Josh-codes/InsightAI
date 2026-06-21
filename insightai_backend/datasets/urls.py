from django.urls import path
from .views import DatasetUploadView, DatasetListView, DatasetDetailView

urlpatterns = [
    path('upload/', DatasetUploadView.as_view(), name='dataset-upload'),
    path('', DatasetListView.as_view(), name='dataset-list'),
    path('<int:pk>/', DatasetDetailView.as_view(), name='dataset-detail'),
]
