import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface UploadRestaurantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void; // 添加提交成功回调
  campus: string;
}

export function UploadRestaurantDialog({ isOpen, onClose, onSubmitSuccess, campus }: UploadRestaurantDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    openHours: '',
    recommendedDishes: '',
    image: null as File | null,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const availableTags = ['便宜', '不排队', '夜宵', '量大', '好吃', '快捷', '实惠', '人气'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填项
    if (!formData.name || !formData.location || !formData.openHours) {
      toast.error('请填写所有必填项');
      return;
    }

    // 这里应该发送到后端
    console.log({
      ...formData,
      tags: selectedTags,
      campus
    });

    toast.success('商家信息已提交，等待审核！');
    
    // 重置表单
    setFormData({
      name: '',
      location: '',
      openHours: '',
      recommendedDishes: '',
      image: null,
    });
    setSelectedTags([]);
    setImagePreview(null);
    onClose();
    
    // 触发提交成功回调（3秒后显示审核通过）
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
    
    // Add to mock data for demo purposes
    import('../data/mockData').then((module) => {
      const newRestaurant = {
        id: 'new-store-mock',
        name: formData.name,
        category: '小吃',
        campus: campus,
        price: 15,
        distance: 100,
        rating: 5.0,
        image: imagePreview || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        tags: selectedTags.length > 0 ? selectedTags : ['新店'],
        location: { lat: 39.9880, lng: 116.3295, description: formData.location },
        popularDishes: formData.recommendedDishes ? formData.recommendedDishes.split(/[,，、]/) : [],
        votes: { crowded: 0, delicious: 0, fast: 0, slow: 0 },
        verifyVotes: { hasIt: 1, tasty: 0, closed: 0 },
        openHours: formData.openHours,
        phone: '暂无',
        isStreetVendor: true,
      };
      
      // Update mockRestaurants if not already added
      const existing = module.mockRestaurants.find(r => r.id === 'new-store-mock');
      if (!existing) {
        module.mockRestaurants.unshift(newRestaurant as any);
      } else {
        Object.assign(existing, newRestaurant);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E2001A] to-[#FF9512] bg-clip-text text-transparent">
            上传商家信息
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            请填写商家信息并上传图片，我们将尽快审核。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 上传图片 */}
          <div className="space-y-2">
            <Label className="text-base">商家图片 <span className="text-red-500">*</span></Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E2001A] transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">点击上传图片</p>
                  <p className="text-sm text-gray-400 mt-1">支持 JPG、PNG 格式</p>
                </label>
              )}
            </div>
          </div>

          {/* 商家名称 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              商家名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如：北门烤冷面摊"
              required
            />
          </div>

          {/* 地理位置 */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">
              大致位置 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="例如：北京服装学院北门口"
              required
            />
          </div>

          {/* 营业时间 */}
          <div className="space-y-2">
            <Label htmlFor="openHours" className="text-base">
              营业时间 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="openHours"
              value={formData.openHours}
              onChange={(e) => setFormData(prev => ({ ...prev, openHours: e.target.value }))}
              placeholder="例如：晚上20:00-22:00"
              required
            />
          </div>

          {/* 推荐菜 */}
          <div className="space-y-2">
            <Label htmlFor="recommendedDishes" className="text-base">
              推荐菜品
            </Label>
            <Textarea
              id="recommendedDishes"
              value={formData.recommendedDishes}
              onChange={(e) => setFormData(prev => ({ ...prev, recommendedDishes: e.target.value }))}
              placeholder="例如：烤冷面、炸串、关东煮"
              rows={3}
            />
          </div>

          {/* 标签选择 */}
          <div className="space-y-2">
            <Label className="text-base">标签</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#E2001A] to-[#FF9512] hover:opacity-90 text-white"
            >
              提交审核
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}