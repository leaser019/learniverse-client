'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const defaultAvatar = 'https://github.com/shadcn.png';

const getUserData = () => {
  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  return {
    username: data.username || 'NoName',
    email: data.email || 'noemail@nowhere.com',
    role: data.role || 'user',
    createdAt: data.createdAt || 'Unknown',
    avatar: data.avatar || defaultAvatar,
  };
};

const saveUserData = (data: any) => {
  localStorage.setItem('userData', JSON.stringify(data));
};

const UserPage = () => {
  const [userData, setUserData] = useState(getUserData());
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(getUserData());
  const [toast, setToast] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(form.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  useEffect(() => {
    setUserData(getUserData());
    setForm(getUserData());
    setAvatarPreview(getUserData().avatar);

    const generateStars = () => {
      const newStars = Array(50)
        .fill(0)
        .map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
        }));
      setStars(newStars);
    };
    generateStars();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
      setForm({ ...form, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.username.trim() || !form.email.trim()) {
      setToast('Tên và email không được để trống nha bro!');
      return;
    }
    setUserData(form);
    saveUserData(form);
    setEditMode(false);
    setToast('Lưu thông tin thành công! Đỉnh của chóp!');
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm(userData);
    setAvatarPreview(userData.avatar);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(userData);
    setAvatarPreview(userData.avatar);
    setToast('Huỷ rồi, không thay đổi gì đâu nha!');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-4 overflow-hidden relative rounded-2xl">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
            zIndex: 0,
          }}
        />
      ))}
      <div
        className={cn(
          'w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6',
          'border border-blue-200 relative z-10'
        )}
      >
        <div className="relative group">
          <Avatar
            className="w-24 h-24 ring-4 ring-blue-300 cursor-pointer transition-all duration-200 hover:ring-cyan-400"
            onClick={editMode ? handleAvatarClick : undefined}
          >
            <AvatarImage src={avatarPreview} />
            <AvatarFallback>{form.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          {editMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-xs font-semibold">Đổi ảnh</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="text-center w-full">
          {editMode ? (
            <>
              <input
                className="text-2xl font-bold text-blue-700 mb-1 text-center border-b border-blue-200 outline-none bg-transparent w-full"
                name="username"
                value={form.username}
                onChange={handleChange}
                maxLength={32}
                autoFocus
                placeholder="Tên người dùng"
              />
              <input
                className="text-gray-500 mb-2 text-center border-b border-blue-200 outline-none bg-transparent w-full"
                name="email"
                value={form.email}
                onChange={handleChange}
                maxLength={64}
                placeholder="Email"
                type="email"
              />
              <input
                className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2 text-center border-b border-blue-200 outline-none bg-transparent w-full"
                name="role"
                value={form.role}
                onChange={handleChange}
                maxLength={16}
                placeholder="Vai trò"
              />
              <input
                className="text-xs text-gray-400 text-center border-b border-blue-200 outline-none bg-transparent w-full"
                name="createdAt"
                value={form.createdAt}
                onChange={handleChange}
                maxLength={32}
                placeholder="Ngày tham gia"
              />
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition-all active:scale-95"
                >
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-300 transition-all active:scale-95"
                >
                  Huỷ
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-blue-700 mb-1">{userData.username}</h2>
              <p className="text-gray-500 mb-2">{userData.email}</p>
              <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {userData.role}
              </span>
              <div className="text-xs text-gray-400">
                Joined: {userData.createdAt?.slice(0, 10)}
              </div>
              <button
                onClick={handleEdit}
                className="mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full hover:bg-blue-200 transition-all active:scale-95"
              >
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce z-50">
            {toast}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPage;
