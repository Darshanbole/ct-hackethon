import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  Sparkles,
  Zap,
  Sunset,
  Bot,
  Settings,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeSwitcher = ({ variant = 'button' }) => {
  const { theme, themes, setTheme, isDark, getThemeIcon, getThemeDescription } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeIconComponent = (themeName) => {
    const iconProps = { className: "h-4 w-4" };
    switch (themeName) {
      case 'light': return <Sun {...iconProps} />;
      case 'dark': return <Moon {...iconProps} />;
      case 'system': return <Monitor {...iconProps} />;
      case 'cyberpunk': return <Bot {...iconProps} />;
      case 'neon': return <Zap {...iconProps} />;
      case 'sunset': return <Sunset {...iconProps} />;
      default: return <Palette {...iconProps} />;
    }
  };

  const themePreview = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      accent: 'bg-blue-500',
      secondary: 'bg-gray-100'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      accent: 'bg-blue-400',
      secondary: 'bg-gray-800'
    },
    system: {
      bg: isDark ? 'bg-gray-900' : 'bg-white',
      text: isDark ? 'text-white' : 'text-gray-900',
      accent: 'bg-blue-500',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-100'
    },
    cyberpunk: {
      bg: 'bg-black',
      text: 'text-purple-300',
      accent: 'bg-purple-500',
      secondary: 'bg-purple-900'
    },
    neon: {
      bg: 'bg-gray-900',
      text: 'text-yellow-300',
      accent: 'bg-yellow-400',
      secondary: 'bg-green-900'
    },
    sunset: {
      bg: 'bg-orange-900',
      text: 'text-orange-100',
      accent: 'bg-orange-400',
      secondary: 'bg-red-900'
    }
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {getThemeIconComponent(theme)}
            <span className="hidden sm:inline">{theme}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(themes).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(value)}
              className="gap-2"
            >
              {getThemeIconComponent(value)}
              <span className="flex-1 capitalize">{value}</span>
              {theme === value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {getThemeIconComponent(theme)}
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose Your Theme
          </DialogTitle>
          <DialogDescription>
            Customize your experience with different themes and color schemes
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(themes).map(([key, value]) => {
              const preview = themePreview[value];
              const isSelected = theme === value;

              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setTheme(value)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getThemeIconComponent(value)}
                          <span className="capitalize">{value}</span>
                        </CardTitle>
                        {isSelected && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {getThemeDescription(value)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Theme Preview */}
                      <div className={`rounded-lg p-3 ${preview.bg} border`}>
                        <div className="space-y-2">
                          <div className={`h-2 w-full ${preview.secondary} rounded`} />
                          <div className="flex gap-2">
                            <div className={`h-2 w-1/3 ${preview.accent} rounded`} />
                            <div className={`h-2 w-1/4 ${preview.secondary} rounded`} />
                          </div>
                          <div className={`h-1 w-2/3 ${preview.secondary} rounded`} />
                          <div className="flex gap-1">
                            <div className={`h-1 w-8 ${preview.accent} rounded-full`} />
                            <div className={`h-1 w-6 ${preview.secondary} rounded-full`} />
                            <div className={`h-1 w-4 ${preview.secondary} rounded-full`} />
                          </div>
                        </div>
                      </div>

                      {/* Theme Features */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {value === 'system' && (
                          <Badge variant="secondary" className="text-xs">
                            <Monitor className="h-3 w-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                        {(value === 'cyberpunk' || value === 'neon') && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Effects
                          </Badge>
                        )}
                        {value === 'dark' || value === 'cyberpunk' || value === 'neon' || value === 'sunset' ? (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Dark
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Sun className="h-3 w-3 mr-1" />
                            Light
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Theme preference is automatically saved</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSwitcher;