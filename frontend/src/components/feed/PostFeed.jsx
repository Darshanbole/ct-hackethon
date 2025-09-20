import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import PostCreator from "../post/PostCreator";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { postsAPI } from "../../services/api";

const PostFeed = ({ posts: externalPosts, initialPosts = [], isLoading = false }) => {
  const [posts, setPosts] = useState(externalPosts !== undefined ? externalPosts : initialPosts);
  const [loading, setLoading] = useState(isLoading);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced mock data for demonstration
  const mockPosts = [
    {
      id: "1",
      author: {
        name: "Alex Johnson",
        username: "alexj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
      content:
        "Just deployed my first smart contract on Shardeum! 🚀 The gas fees are incredibly low compared to other chains. This is the future of blockchain! #blockchain #web3 #shardeum\n\nAnyone else building on this platform?",
      timestamp: "2024-01-15T14:30:00Z",
      likes: 42,
      comments: 7,
      shares: 3,
      liked: false,
    },
    {
      id: "2",
      author: {
        name: "Sophia Chen",
        username: "sophiac",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      },
      content:
        "Working on a decentralized social media platform where users truly own their data! 💪 No more algorithm manipulation or data harvesting. The future is decentralized! #decentralized #privacy #web3",
      image:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
      timestamp: "2024-01-15T12:15:00Z",
      likes: 128,
      comments: 23,
      shares: 15,
      liked: true,
    },
    {
      id: "3",
      author: {
        name: "Marcus Williams",
        username: "marcusw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      },
      content:
        "Attended an amazing Web3 hackathon this weekend! 🎉 Met so many talented developers building the future of the internet. The innovation happening in this space is incredible!\n\n#hackathon #web3 #innovation #networking",
      timestamp: "2024-01-14T18:45:00Z",
      likes: 76,
      comments: 12,
      shares: 5,
      liked: false,
    },
    {
      id: "4",
      author: {
        name: "Emma Rodriguez",
        username: "emmar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      content:
        "New NFT collection dropping tomorrow! 🎨 Each piece represents a different aspect of digital identity in the metaverse. Can't wait to share this with the community!",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      timestamp: "2024-01-14T16:20:00Z",
      likes: 203,
      comments: 45,
      shares: 28,
      liked: false,
    },
    {
      id: "5",
      author: {
        name: "David Kim",
        username: "davidk",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      content:
        "DeFi yields are looking interesting this week! 📈 Always remember to DYOR and never invest more than you can afford to lose. The crypto market is volatile but full of opportunities! #DeFi #crypto #investing",
      timestamp: "2024-01-14T14:10:00Z",
      likes: 89,
      comments: 34,
      shares: 12,
      liked: true,
    },
  ];

  useEffect(() => {
    // Update posts when external posts change
    if (externalPosts !== undefined) {
      setPosts(externalPosts);
    } else {
      loadPosts();
    }
  }, [externalPosts]);

  useEffect(() => {
    // Only load posts if no external posts provided
    if (externalPosts === undefined) {
      loadPosts();
    }
  }, []);

  const loadPosts = async () => {
    if (externalPosts === undefined && initialPosts.length === 0 && !isLoading) {
      setLoading(true);
      try {
        const response = await postsAPI.getPosts(1, 10);
        setPosts(response.posts || mockPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
        // Fallback to mock data
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadMorePosts = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call to fetch more posts
    setTimeout(() => {
      // Generate new mock posts with different IDs
      const newPosts = mockPosts.slice(0, 3).map((post, index) => ({
        ...post,
        id: `${post.id}-page-${page}-${index}`,
        content: `${post.content}\n\n[Page ${page} content]`,
        likes: Math.floor(Math.random() * 200) + 10,
        comments: Math.floor(Math.random() * 50) + 1,
        shares: Math.floor(Math.random() * 30) + 1,
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);

      // Stop loading after 5 pages for demo purposes
      if (page >= 5) {
        setHasMore(false);
      }

      setLoading(false);
    }, 1500);
  };

  const refreshFeed = async () => {
    setRefreshing(true);
    
    // Simulate refresh API call
    setTimeout(() => {
      // Add some new posts at the beginning
      const newPosts = [
        {
          id: `refresh-${Date.now()}`,
          author: {
            name: "Fresh Content",
            username: "freshcontent",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fresh",
          },
          content: "🔄 Feed refreshed! Here's some fresh content for you. Stay updated with the latest posts! #refresh #newcontent",
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false,
        },
        ...mockPosts.slice(0, 2).map(post => ({
          ...post,
          id: `refresh-${post.id}`,
          likes: Math.floor(Math.random() * 100) + 50,
        }))
      ];
      
      setPosts(newPosts);
      setPage(1);
      setHasMore(true);
      setRefreshing(false);
    }, 1000);
  };

  // Handle scroll event for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const handlePostCreated = async (newPost) => {
    try {
      const response = await postsAPI.createPost({
        content: newPost.content,
        image_url: newPost.image,
        platform: 'hub'
      });
      
      const post = {
        id: response.post.id,
        timestamp: response.post.created_at,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        ...response.post,
      };

      setPosts((prevPosts) => [post, ...prevPosts]);
    } catch (error) {
      console.error('Failed to create post:', error);
      // Fallback to optimistic update
      const post = {
        id: `new-${Date.now()}`,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        ...newPost,
      };

      setPosts((prevPosts) => [post, ...prevPosts]);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await postsAPI.interactWithPost(postId, 'like');
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error('Failed to like post:', error);
      // Still update UI optimistically
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      );
    }
  };

  const handleCommentPost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    );
  };

  const handleSharePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post,
      ),
    );
  };

  const handleClickPost = (postId) => {
    alert(`Opening post ${postId} in detail view! 📖`);
  };

  // Transform post data to match PostCard interface
  const transformPost = (post) => ({
    id: post.id,
    content: post.content,
    image: post.image,
    timestamp: post.timestamp,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    author: post.author,
  });

  return (
    <div className="w-full max-w-2xl mx-auto bg-background">
      {/* Header with refresh button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border mb-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Latest Posts</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshFeed}
            disabled={refreshing}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <PostCreator onPostCreated={handlePostCreated} />
      </div>

      <div className="space-y-4 px-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard 
              post={transformPost(post)} 
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onShare={handleSharePost}
              onClickPost={handleClickPost}
            />
          </motion.div>
        ))}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={`skeleton-${i}`}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !hasMore && posts.length > 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <p>🎉 You've reached the end! No more posts to load.</p>
            <Button 
              variant="outline" 
              onClick={refreshFeed}
              className="mt-2"
            >
              Refresh Feed
            </Button>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No posts yet. Be the first to share something! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeed;