from rest_framework.response import Response


def success_response(data=None, status=200):
    return Response({'success': True, 'data': data}, status=status)


def error_response(message, status=400, errors=None):
    body = {'success': False, 'message': message}
    if errors:
        body['errors'] = errors
    return Response(body, status=status)
