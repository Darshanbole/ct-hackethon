import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Globe,
  Shield,
  Users,
  Trophy,
  Heart,
  Star,
  Rocket,
  ChevronRight,
  Play,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage = ({ onEnterApp }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant transactions with zero gas fees",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ultra Secure",
      description: "Military-grade encryption for your data",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Connect with millions worldwide",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Award Winning",
      description: "Recognized by international organizations",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  const socialPlatforms = [
    {
      name: "DecentralTwitter",
      icon: <Twitter className="w-6 h-6" />,
      description: "Uncensored social media with crypto rewards",
      color: "from-sky-400 to-blue-600",
      users: "2.1M"
    },
    {
      name: "Web3 Instagram",
      icon: <Instagram className="w-6 h-6" />,
      description: "Share moments, earn NFTs automatically",
      color: "from-pink-400 to-rose-600",
      users: "1.8M"
    },
    {
      name: "Decentralized YouTube",
      icon: <Youtube className="w-6 h-6" />,
      description: "Creator-owned video platform",
      color: "from-red-400 to-red-600",
      users: "950K"
    },
    {
      name: "Meta Facebook",
      icon: <Facebook className="w-6 h-6" />,
      description: "Community-governed social network",
      color: "from-blue-500 to-indigo-600",
      users: "3.2M"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Cursor follower */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-6"
      >
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SocialVerse Web3
          </span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {['Features', 'Platforms', 'Community', 'About'].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onHoverStart={() => setIsHovering(item)}
              onHoverEnd={() => setIsHovering(null)}
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight"
          >
            The Future of
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Social Media
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the next generation of decentralized social platforms. 
            Connect, create, and earn in a world where you own your data and content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Launch App
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => navigate('/social/multiplatform')}
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg rounded-full hover:bg-blue-50 transition-all duration-300 group"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Multi-Platform Posting
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              onHoverStart={() => setIsHovering(`feature-${index}`)}
              onHoverEnd={() => setIsHovering(null)}
              className="cursor-pointer"
            >
              <Card className={`h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                isHovering === `feature-${index}` ? 'shadow-2xl' : ''
              }`}>
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Platforms Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              Integrated Social Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access all your favorite social platforms in one decentralized ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsHovering(`platform-${index}`)}
                onHoverEnd={() => setIsHovering(null)}
                className="cursor-pointer"
              >
                <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  isHovering === `platform-${index}` ? 'shadow-2xl transform scale-[1.02]' : ''
                }`}>
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center text-white flex-shrink-0`}
                        whileHover={{ rotate: 15 }}
                      >
                        {platform.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">{platform.name}</h3>
                          <Badge className="bg-green-100 text-green-800 px-3 py-1">
                            {platform.users} users
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{platform.description}</p>
                        <motion.div
                          className="flex items-center text-blue-600 font-semibold"
                          whileHover={{ x: 5 }}
                        >
                          Explore Platform
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: "Active Users", value: "10M+", icon: <Users className="w-8 h-8" /> },
            { label: "Transactions", value: "500M+", icon: <Zap className="w-8 h-8" /> },
            { label: "Countries", value: "150+", icon: <Globe className="w-8 h-8" /> },
            { label: "Uptime", value: "99.9%", icon: <Shield className="w-8 h-8" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of the future of social media. Experience true ownership and freedom.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <Star className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-20 py-12"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            {[
              { icon: <Twitter className="w-6 h-6" />, color: "hover:text-blue-500" },
              { icon: <Github className="w-6 h-6" />, color: "hover:text-gray-800" },
              { icon: <Linkedin className="w-6 h-6" />, color: "hover:text-blue-600" },
              { icon: <Instagram className="w-6 h-6" />, color: "hover:text-pink-500" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href="#"
                className={`text-gray-400 ${social.color} transition-colors p-3 rounded-full hover:bg-gray-100`}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          <p className="text-gray-600">
            © 2025 SocialVerse Web3. Building the future of decentralized social media.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;