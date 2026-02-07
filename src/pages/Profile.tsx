import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, X, User, Tag, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const EMOJI_OPTIONS = ['📦', '🍎', '🥤', '🧹', '💄', '🔧', '🎮', '📚', '🌿', '🍳'];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { categories, addCategory, deleteCategory, isLoading } = useCategories();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Please enter a category name',
        variant: 'destructive',
      });
      return;
    }

    await addCategory.mutateAsync({
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
    });

    setNewCategoryName('');
    setNewCategoryIcon('📦');
    setDialogOpen(false);
  };

  const handleDeleteCategory = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast({
        title: 'Cannot delete default categories',
        variant: 'destructive',
      });
      return;
    }
    await deleteCategory.mutateAsync(id);
  };

  return (
    <AppLayout title="Profile">
      <div className="p-4 space-y-4">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Display Name</Label>
              <p className="font-medium">{user?.user_metadata?.display_name || 'User'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categories
                </CardTitle>
                <CardDescription>Manage your product categories</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input
                        placeholder="e.g., Snacks, Pet Food"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="flex flex-wrap gap-2">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <Button
                            key={emoji}
                            type="button"
                            variant={newCategoryIcon === emoji ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setNewCategoryIcon(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAddCategory}
                      disabled={addCategory.isPending}
                    >
                      {addCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 px-3"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    {!cat.is_default && (
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.is_default)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
