import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { 
  UserIcon,
  ArrowLeftIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  preferredLanguage: string
  newsletter: boolean
  smsNotifications: boolean
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export default function Profile() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    gender: '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    preferredLanguage: 'zh-TW',
    newsletter: true,
    smsNotifications: false
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errors, setErrors] = useState<any>({})

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 更新用户信息
      updateUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        address: profileForm.address
      })

      toast.success('個人資料更新成功！')
    } catch (error) {
      toast.error('更新失敗，請重試')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证密码
    const newErrors: any = {}
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = '請輸入當前密碼'
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = '請輸入新密碼'
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = '密碼至少需要6個字符'
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = '新密碼不一致'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      })

      toast.success('密碼更新成功！')
    } catch (error) {
      toast.error('密碼更新失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 模拟头像上传
      toast.success('頭像上傳成功！')
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(passwordForm.newPassword)

  return (
    <Layout
      seo={{
        title: '編輯個人資料 - BIZOE',
        description: '管理您的個人資料和帳戶設定',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                返回帳戶
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">編輯個人資料</h1>
                <p className="text-gray-600">管理您的個人資料和偏好設定</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'personal', label: '個人資料' },
                    { id: 'password', label: '密碼安全' },
                    { id: 'preferences', label: '偏好設定' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-primary-600" />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 cursor-pointer hover:bg-gray-50">
                          <CameraIcon className="w-4 h-4 text-gray-600" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          會員自 {new Date(user?.createdAt || Date.now()).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">基本資料</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                              姓氏 *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              value={profileForm.firstName}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                              className="input"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                              名字 *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              value={profileForm.lastName}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                              className="input"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            電子郵件 *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="input"
                            required
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">電子郵件無法修改</p>
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            電話號碼
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                            生日
                          </label>
                          <input
                            type="date"
                            id="dateOfBirth"
                            value={profileForm.dateOfBirth}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            className="input"
                          />
                        </div>
                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            性別
                          </label>
                          <select
                            id="gender"
                            value={profileForm.gender}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                            className="input"
                          >
                            <option value="">請選擇</option>
                            <option value="male">男</option>
                            <option value="female">女</option>
                            <option value="other">其他</option>
                            <option value="prefer_not_to_say">不願透露</option>
                          </select>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">地址資訊</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                              地址
                            </label>
                            <input
                              type="text"
                              id="address"
                              value={profileForm.address}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                              className="input"
                              placeholder="街道地址"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                城市
                              </label>
                              <input
                                type="text"
                                id="city"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                                className="input"
                              />
                            </div>
                            <div>
                              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                州/省
                              </label>
                              <input
                                type="text"
                                id="state"
                                value={profileForm.state}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                                className="input"
                              />
                            </div>
                            <div>
                              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                郵遞區號
                              </label>
                              <input
                                type="text"
                                id="zipCode"
                                value={profileForm.zipCode}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, zipCode: e.target.value }))}
                                className="input"
                              />
                            </div>
                            <div>
                              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                國家
                              </label>
                              <select
                                id="country"
                                value={profileForm.country}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                                className="input"
                              >
                                <option value="US">美國</option>
                                <option value="CA">加拿大</option>
                                <option value="TW">台灣</option>
                                <option value="HK">香港</option>
                                <option value="SG">新加坡</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? '更新中...' : '更新資料'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Password Security Tab */}
                {activeTab === 'password' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">變更密碼</h3>
                      <p className="text-gray-600 mb-6">
                        為了您的帳戶安全，請定期更新密碼。新密碼應包含大小寫字母、數字和特殊字符。
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          當前密碼 *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            id="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={(e) => {
                              setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))
                              if (errors.currentPassword) {
                                setErrors(prev => ({ ...prev, currentPassword: undefined }))
                              }
                            }}
                            className={`input pr-10 ${errors.currentPassword ? 'border-red-300' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                        )}
                      </div>

                      {/* New Password */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          新密碼 *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={passwordForm.newPassword}
                            onChange={(e) => {
                              setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))
                              if (errors.newPassword) {
                                setErrors(prev => ({ ...prev, newPassword: undefined }))
                              }
                            }}
                            className={`input pr-10 ${errors.newPassword ? 'border-red-300' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordForm.newPassword && (
                          <div className="mt-2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full ${
                                    i < passwordStrength 
                                      ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              密碼強度: {passwordStrength <= 2 ? '弱' : passwordStrength <= 3 ? '中等' : '強'}
                            </p>
                          </div>
                        )}

                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          確認新密碼 *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmNewPassword"
                            value={passwordForm.confirmNewPassword}
                            onChange={(e) => {
                              setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))
                              if (errors.confirmNewPassword) {
                                setErrors(prev => ({ ...prev, confirmNewPassword: undefined }))
                              }
                            }}
                            className={`input pr-10 ${errors.confirmNewPassword ? 'border-red-300' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.confirmNewPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? '更新中...' : '更新密碼'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">偏好設定</h3>
                    </div>

                    <form className="space-y-6">
                      {/* Language Preference */}
                      <div>
                        <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                          偏好語言
                        </label>
                        <select
                          id="preferredLanguage"
                          value={profileForm.preferredLanguage}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                          className="input max-w-xs"
                        >
                          <option value="zh-TW">繁體中文</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      {/* Notification Preferences */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">通知偏好</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label htmlFor="newsletter" className="font-medium text-gray-900">
                                電子報訂閱
                              </label>
                              <p className="text-sm text-gray-600">接收產品更新、優惠活動和3D列印技巧</p>
                            </div>
                            <input
                              type="checkbox"
                              id="newsletter"
                              checked={profileForm.newsletter}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, newsletter: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label htmlFor="smsNotifications" className="font-medium text-gray-900">
                                簡訊通知
                              </label>
                              <p className="text-sm text-gray-600">接收訂單狀態和配送通知</p>
                            </div>
                            <input
                              type="checkbox"
                              id="smsNotifications"
                              checked={profileForm.smsNotifications}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                        onClick={(e) => {
                          e.preventDefault()
                          toast.success('偏好設定已更新')
                        }}
                      >
                        保存設定
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">總訂單數</p>
                    <p className="text-2xl font-bold text-primary-600">12</p>
                  </div>
                  <ShoppingBagIcon className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">累計消費</p>
                    <p className="text-2xl font-bold text-green-600">$2,456</p>
                  </div>
                  <UserIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">會員等級</p>
                    <p className="text-2xl font-bold text-yellow-600">金級</p>
                  </div>
                  <CheckIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}
