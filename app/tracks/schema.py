import graphene
from graphql import GraphQLError
from .models import Track, Like
from graphene_django import DjangoObjectType
from users.schema import UserType
from django.db.models import Q
class TrackType(DjangoObjectType):
    class Meta:
        model = Track

class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search = graphene.String())
    likes = graphene.List(LikeType)

    def resolve_likes(self,info, ):
        return Like.objects.all()

    def resolve_tracks(self, info,search=None):

        if search:
            filter = (
                Q(title__icontains=search)|
                Q(description__icontains=search)|
                Q(url__icontains=search)|
                Q(posted_by__username__icontains=search)
            )
            return Track.objects.filter(filter)
        return Track.objects.all()

    
class CreateLike(graphene.Mutation):
    track = graphene.Field(TrackType)
    user = graphene.Field(UserType)
    class Arguments:
        track_id = graphene.Int(required = True)

    def mutate(self, info, track_id):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError("Login to like tracks")

        track = Track.objects.get(id = track_id)

        if not track:
            raise GraphQLError("Cannot find track with given track id")
        Like.objects.create(user = user, track=track)

        return CreateLike(user = user, track=track)


class CreateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, title, description, url):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError("login to add a track")
        track = Track(title=title, description=description, url=url, posted_by = user)

        track.save()
        return CreateTrack(track=track)

class DeleteTrack(graphene.Mutation):
    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        track = Track.objects.get(id=track_id)
        user = info.context.user

        if track.posted_by  != user:
            raise GraphQLError("You can't Delete this track")
        track.delete() 

        return DeleteTrack(track_id=track_id)





class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, title, description, url, track_id):
        user = info.context.user
        track = Track.objects.get(id=track_id)

        if track.posted_by !=user:
            raise GraphQLError("You're not allowed to update this track")

        track.title = title
        track.description = description
        track.url = url

        track.save()
        return UpdateTrack(track = track)



class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    create_like = CreateLike.Field()



    


