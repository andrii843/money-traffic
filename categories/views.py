from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import redirect

from rest_framework import viewsets
from rest_framework.parsers import JSONParser

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt
from categories.models import Category
from categories.serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,))
def get_list(request):
    # and request.is_ajax()
    if request.user.is_authenticated and request.method == 'GET':
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        # return JsonResponse(serializer.data, safe=False)
        return Response(serializer.data)
    elif request.method == 'POST':
        # data = JSONParser().parse(request.POST)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            # serializer.data.user_id = request.user.id
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({})


@csrf_exempt
def simple_category(request, id):
    if not request.user.is_authenticated:
        return redirect('login_in')

    try:
        category = Category.objects.get(id=id, user=request.user)
    except Category.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CategorySerializer(category, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

