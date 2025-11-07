import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { LinearGradient } from 'expo-linear-gradient'
import { memo } from 'react'
import { Text, View } from 'react-native'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string[]
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface AchievementsProps {
  totalOrders: number
  totalRevenue: number
  totalBusinesses: number
}

const AchievementCard = memo(({ achievement }: { achievement: Achievement }) => {
  return (
    <View className='w-[160px]'>
      <LinearGradient
        colors={achievement.unlocked ? achievement.color : ['#e5e7eb', '#d1d5db']}
        className={`rounded-2xl p-4 shadow-lg ${!achievement.unlocked && 'opacity-60'}`}
      >
        <View className='items-center mb-3'>
          <View className={`bg-white/30 rounded-full p-4 mb-2 ${!achievement.unlocked && 'opacity-50'}`}>
            <FontAwesome5 
              name={achievement.icon as any} 
              size={32} 
              color={achievement.unlocked ? 'white' : '#9ca3af'} 
            />
          </View>
          {achievement.unlocked && (
            <View className='bg-white/30 px-2 py-0.5 rounded-full'>
              <Text className='text-white text-xs font-bold'>
                ✓ DESBLOQUEADO
              </Text>
            </View>
          )}
        </View>
        <Text className={`font-extrabold text-center mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
          {achievement.title}
        </Text>
        <Text className={`text-xs text-center ${achievement.unlocked ? 'text-white/90' : 'text-gray-500'}`}>
          {achievement.description}
        </Text>
        {achievement.progress !== undefined && achievement.maxProgress && (
          <View className='mt-3'>
            <View className='bg-white/30 rounded-full h-2 overflow-hidden'>
              <View 
                className='bg-white h-full rounded-full'
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </View>
            <Text className={`text-xs text-center mt-1 font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  )
})

export default function AchievementsComponent({ 
  totalOrders, 
  totalRevenue, 
  totalBusinesses 
}: AchievementsProps) {
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primer Paso',
      description: 'Completa tu primer pedido',
      icon: 'flag-checkered',
      color: ['#10b981', '#059669'],
      unlocked: totalOrders >= 1,
      progress: Math.min(totalOrders, 1),
      maxProgress: 1,
    },
    {
      id: '2',
      title: 'Emprendedor',
      description: 'Registra tu primer negocio',
      icon: 'store',
      color: ['#3b82f6', '#2563eb'],
      unlocked: totalBusinesses >= 1,
      progress: Math.min(totalBusinesses, 1),
      maxProgress: 1,
    },
    {
      id: '3',
      title: 'En Marcha',
      description: 'Completa 10 pedidos',
      icon: 'rocket',
      color: ['#f59e0b', '#d97706'],
      unlocked: totalOrders >= 10,
      progress: Math.min(totalOrders, 10),
      maxProgress: 10,
    },
    {
      id: '4',
      title: 'Vendedor Pro',
      description: 'Alcanza $50,000 en ventas',
      icon: 'dollar-sign',
      color: ['#8b5cf6', '#7c3aed'],
      unlocked: totalRevenue >= 50000,
      progress: Math.min(totalRevenue, 50000),
      maxProgress: 50000,
    },
    {
      id: '5',
      title: 'Imparable',
      description: 'Completa 50 pedidos',
      icon: 'fire',
      color: ['#ef4444', '#dc2626'],
      unlocked: totalOrders >= 50,
      progress: Math.min(totalOrders, 50),
      maxProgress: 50,
    },
    {
      id: '6',
      title: 'Imperio',
      description: 'Gestiona 3 negocios',
      icon: 'crown',
      color: ['#eab308', '#ca8a04'],
      unlocked: totalBusinesses >= 3,
      progress: Math.min(totalBusinesses, 3),
      maxProgress: 3,
    },
    {
      id: '7',
      title: 'Maestro',
      description: 'Completa 100 pedidos',
      icon: 'trophy',
      color: ['#ec4899', '#db2777'],
      unlocked: totalOrders >= 100,
      progress: Math.min(totalOrders, 100),
      maxProgress: 100,
    },
    {
      id: '8',
      title: 'Millonario',
      description: 'Alcanza $1,000,000 en ventas',
      icon: 'gem',
      color: ['#06b6d4', '#0891b2'],
      unlocked: totalRevenue >= 1000000,
      progress: Math.min(totalRevenue, 1000000),
      maxProgress: 1000000,
    },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <View className='mb-6'>
      <View className='flex-row items-center justify-between mb-4'>
        <View className='flex-row items-center gap-2'>
          <FontAwesome5 name='award' size={20} color='#dc2626' />
          <Text className='text-2xl font-extrabold text-gray-900'>
            Logros
          </Text>
        </View>
        <View className='bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2 rounded-xl shadow-md'>
          <Text className='text-white font-extrabold text-sm'>
            {unlockedCount}/{achievements.length}
          </Text>
        </View>
      </View>

      {/* Barra de progreso general */}
      <View className='bg-white rounded-2xl p-4 shadow-lg mb-4'>
        <View className='flex-row justify-between items-center mb-2'>
          <Text className='text-gray-700 font-bold'>Progreso Total</Text>
          <Text className='text-gray-900 font-extrabold text-lg'>
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </Text>
        </View>
        <View className='bg-gray-200 rounded-full h-3 overflow-hidden'>
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className='h-full rounded-full'
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </View>
        <Text className='text-gray-500 text-xs text-center mt-2'>
          ¡Sigue trabajando para desbloquear más logros!
        </Text>
      </View>

      {/* Grid de logros */}
      <View className='flex-row flex-wrap gap-3'>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </View>

      {/* Próximo logro */}
      {unlockedCount < achievements.length && (
        <View className='mt-4'>
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            className='rounded-2xl p-5 shadow-lg'
          >
            <View className='flex-row items-center gap-3 mb-3'>
              <View className='bg-yellow-500 rounded-full p-2'>
                <FontAwesome5 name='star' size={16} color='white' />
              </View>
              <Text className='text-gray-900 font-extrabold text-lg'>
                Próximo Logro
              </Text>
            </View>
            {(() => {
              const nextAchievement = achievements.find(a => !a.unlocked)
              if (nextAchievement) {
                return (
                  <View className='bg-white/70 rounded-xl p-4'>
                    <Text className='text-gray-900 font-bold text-base mb-1'>
                      {nextAchievement.title}
                    </Text>
                    <Text className='text-gray-700 text-sm mb-3'>
                      {nextAchievement.description}
                    </Text>
                    {nextAchievement.progress !== undefined && nextAchievement.maxProgress && (
                      <>
                        <View className='bg-gray-200 rounded-full h-2 overflow-hidden mb-2'>
                          <View 
                            className='bg-yellow-500 h-full rounded-full'
                            style={{ 
                              width: `${(nextAchievement.progress / nextAchievement.maxProgress) * 100}%` 
                            }}
                          />
                        </View>
                        <Text className='text-gray-600 text-xs text-right font-bold'>
                          {nextAchievement.progress.toLocaleString('es-AR')} / {nextAchievement.maxProgress.toLocaleString('es-AR')}
                        </Text>
                      </>
                    )}
                  </View>
                )
              }
              return (
                <Text className='text-gray-700 text-center font-semibold'>
                  ¡Has desbloqueado todos los logros! 🎉
                </Text>
              )
            })()}
          </LinearGradient>
        </View>
      )}
    </View>
  )
}
