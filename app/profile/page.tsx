"use client";
import { Button } from "@/components/ui/button";
import { useUser } from '@/lib/hooks/useUser';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const { user } = useUser();
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        avatar: url,
      });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        avatar: user.avatar || "",
      });
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Optional if you're using a loading state
    try {
      let avatarUrl = formData.avatar || '/globe.svg';
  
      // Handle avatar upload if there's a new file
      if (avatar && avatar instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append('file', avatar);
  
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: avatarFormData,
        });
  
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          avatarUrl = url;
        }
      }
  
      // Merge avatar URL with the rest of form data
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const updatedUser = await response.json();
      console.log("updatedUser", updatedUser);
      await updateSession({ user: updatedUser });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
              </div>
              <div className="border-t border-gray-200 pt-8">
                <Image
                  src={user?.avatar || "/globe.svg"}
                  alt={user?.name || "username"}
                  width={100}
                  height={100}
                  className="mx-auto rounded-full"
                />
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image Upload
                      </label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1"
                      />
                      {formData.avatar && (
                        <div className="mt-2">
                          <Image
                            src={formData.avatar}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user?.name}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user?.email}
                      </dd>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button onClick={() => setIsEditing(true)}>
                        {isLoading ? 'Editing profile...' : 'Edit Profile'}
                      </Button>
                    </div>
                  </dl>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
