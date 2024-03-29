import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const userId = req.user._id;
  const { content } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(403, "Tweet is required");
  }

  const tweet = await Tweet.create({
    content: content,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const tweets = await Tweet.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched suucessfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params;

  const userId = req.user._id;

  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "Pls provide tweet id");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(403, "Tweet is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "You are not allowed to update");
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated successfullt"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!tweetId) {
    throw new ApiError(400, "Pls provide tweet id");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "You are not allowed to delete");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
