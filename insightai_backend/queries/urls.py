from django.urls import path
from .views import RunQueryView, QueryHistoryView

urlpatterns = [
    path('run/', RunQueryView.as_view(), name='query-run'),
    path('history/', QueryHistoryView.as_view(), name='query-history'),
    path('history/<int:pk>/', QueryHistoryView.as_view(), name='query-history-delete'),
]
