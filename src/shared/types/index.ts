export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface PostUser {
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Post {
  id: string;
  inFeed: boolean;
  mine: boolean;
  user: PostUser;
  image: string;
  fallback: string;
  video?: string;
  caption: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  createdAt: number;
  comments: Comment[];
}

export interface Story {
  username: string;
  avatar: string;
  bg?: string;
  video?: string;
  seen: boolean;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string;
  at: number;
}

export interface ConvUser {
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Conversation {
  id: string;
  user: ConvUser;
  online: boolean;
  unread: number;
  messages: Message[];
}

export interface Profile {
  username: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio: string;
  posts: number;
  followers: number;
  following: number;
}

export type ViewKey = "home" | "explore" | "reels" | "messages" | "profile";
export type TabKey = "posts" | "saved";
