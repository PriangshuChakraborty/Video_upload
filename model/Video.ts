import mongoose,{Schema,model,models} from "mongoose";

const VIDEO_DIMENSION = {
    width:1080,
    height:1920,
} as const;

export interface IVideo {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        width?: number;
        height?: number;
        quality?: number;
    };
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const VideoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        width: { type: Number, default: VIDEO_DIMENSION.width },
        height: { type: Number, default: VIDEO_DIMENSION.height },
        quality: { type: Number, min:1, max:100 }, 
    }
}, {
    timestamps: true,
});

const Video = models.Video || model<IVideo>('Video', VideoSchema);
export default Video;