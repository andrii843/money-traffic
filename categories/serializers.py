from rest_framework import serializers
from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Category
        fields = ('id', 'name',)