"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Rocket, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự").max(50),
  email: z.string().email("Email không hợp lệ"),
  password: z.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất một số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      setLoading(true);
      setError('');

      console.log('Form data:', data);
      const response = await authApi.signup({ username: data.username, email: data.email, password: data.password });

       toast.success('Thành công, xin chào member mới!', {
         duration: 2000,
       });
      
      setTimeout(() => {
        router.push('/login');
      }, 2000)
    } catch (err) {
      setLoading(false);
      toast.error(err, {
      icon: '😭',
      duration: 4000,
    });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-row  bg-white">
      {/* <div className="w-full lg:w-3/5 bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6 flex items-center justify-center overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <RegisterContent />
        </div>
      </div> */}

      <div className="w-full bg-white flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
              Bắt đầu hành trình mới
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Tạo tài khoản và khám phá thế giới kiến thức vô tận
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-sm text-red-600 rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit,err =>{
              console.log(err);
            })} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700 block">
                      Username
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="superlearner"
                          className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700 block">
                      Email
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@learniverse.com"
                          className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700 block">
                      Mật khẩu
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-blue-500" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-500"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-xs" />
                    <div className="text-xs text-gray-500 grid grid-cols-2 gap-2 mt-2">
                      <div className={`flex items-center ${field.value?.match(/[A-Z]/) ? 'text-green-500' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${field.value?.match(/[A-Z]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Ít nhất 1 chữ hoa</span>
                      </div>
                      <div className={`flex items-center ${field.value?.match(/[a-z]/) ? 'text-green-500' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${field.value?.match(/[a-z]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Ít nhất 1 chữ thường</span>
                      </div>
                      <div className={`flex items-center ${field.value?.match(/[0-9]/) ? 'text-green-500' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${field.value?.match(/[0-9]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Ít nhất 1 số</span>
                      </div>
                      <div className={`flex items-center ${field.value?.match(/[^A-Za-z0-9]/) ? 'text-green-500' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${field.value?.match(/[^A-Za-z0-9]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Ít nhất 1 ký tự đặc biệt</span>
                      </div>
                      <div className={`flex items-center ${field.value?.length >= 8 ? 'text-green-500' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${field.value?.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Tối thiểu 8 ký tự</span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium rounded-lg text-sm px-5 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Tạo tài khoản</span>
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-sm text-gray-500 bg-white">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center py-2.5 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 01-5.279-5.28 5.27 5.27 0 015.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 00-8.934 8.934 8.907 8.907 0 008.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                      fill="#4285F4"
                    />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center py-2.5 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <svg
                    className="h-5 w-5 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center py-2.5 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.09-.744.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                  </svg>
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-center text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-400 hover:underline transition-colors"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}


