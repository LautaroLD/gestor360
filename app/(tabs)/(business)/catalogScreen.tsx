import ProductItem from '@/components/ProductItem'
import { Catalog } from '@/models'
import api from '@/services/config'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useQuery } from '@tanstack/react-query'
import * as Print from 'expo-print'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { shareAsync } from 'expo-sharing'
import { useCallback, useLayoutEffect } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'

const templatePdf = (catalog: Catalog) => {
  const itemsPerPage = 12 // ajustá según el tamaño de tus ProductItem
  const pages = []

  for (let i = 0; i < catalog.products.length; i += itemsPerPage) {
    const slice = catalog.products.slice(i, i + itemsPerPage)

    const pageHTML = `
      <div class="page">
        <div class="header">
          <h1>${catalog.title}</h1>
          <p>${catalog.business.name}</p>
          <p>${catalog.business.address}</p>
        </div>
        <div class="products">
          ${slice
            .map(
              (p) => `
              <div class="product">
              ${p.image ? `<img src="${p.image}" alt="${p.title}">` : `<svg xmlns="http://www.w3.org/2000/svg" height="50" width="50" viewBox="0 0 512 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"/></svg>`}
              <div>
              <h3 style="margin: 0;">${p.title}</h3>
              <p style="margin: 0;">${p.description || ''}</p>
              </div>
              <p class="price"><strong>${Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(p.price / 100)}</strong></p>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `
    pages.push(pageHTML)
  }

  const html = `
    <html>
      <head>
        <style>
          @page { size: A4; margin: 0; border: 10px double #dc2626; }
          body { margin: 0; padding: 5px  }
          .page {
            width: 100%;
            height: 100%;
            min-height: 842px; /* A4 height at 72ppi */
            box-sizing: border-box;
            padding: 20px;
            page-break-after: always;
          }
          .header { text-align: center; margin-bottom: 10px; border: 1px solid #dc2626; }
          .products { display: flex; flex-direction: column; gap: 10px; padding: 0 5 0px; }
          .product {  padding: 5px 20px; position: relative; background-color: #f3f3f3; border-radius: 10px; display: flex; gap: 10px; align-items: center  }
          .price { margin-left: auto; margin-bottom: auto;  }
        </style>
      </head>
      <body>
        ${pages.join('')}
      </body>
    </html>
`

  return html
}
export default function CatalogScreen() {
  const navigation = useNavigation()

  const { id } = useLocalSearchParams()
  const {
    data: catalog,
    isPending,
    error,
  } = useQuery({
    queryKey: ['catalog', id],
    queryFn: async () => {
      return (await api.get<Catalog>('/catalog/' + id)).data
    },
    enabled: !!id,
  })
  const printToFile = useCallback(async () => {
    // const uriImage = await captureRef(catalogRef, {
    //   format: 'png',
    //   quality: 1,
    //   snapshotContentContainer: true,
    // })
    // const base64Image = new File(uriImage).base64Sync()

    // 3. Insertar en HTML como data URI
    const html = templatePdf(catalog as Catalog)

    // Generar PDF
    const { uri: pdfUri } = await Print.printToFileAsync({
      html,
      width: 595, // px para A4 a 72 PPI
      height: 842, // px para A4 a 72 PPI
    })

    // Compartir como PDF
    await shareAsync(pdfUri, {
      mimeType: 'application/pdf',
    })
  }, [catalog])
  useLayoutEffect(() => {
    navigation.setOptions({
      title: catalog?.title,
    })
  }, [navigation])
  if (isPending) return <Text>Loading...</Text>
  if (error) return <Text>{error.message}</Text>

  return (
    <View className='flex-1 px-6 py-4'>
      <FlatList
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
        }}
        data={catalog?.products || []}
        renderItem={({ item: p }) => (
          <View key={p.id}>
            <ProductItem p={p} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className='items-center gap-3 min-w-full'>
            <Pressable
              onPress={() => printToFile()}
              className='ml-auto absolute top-0 right-0 z-10'
            >
              {({ pressed }) => {
                return (
                  <View
                    className={`flex-row items-center gap-2 p-3 rounded-full  ${pressed ? 'bg-gray-200' : ''}`}
                  >
                    <FontAwesome5 name='share' size={24} color='black' />
                  </View>
                )
              }}
            </Pressable>
            <Text>{catalog?.business.name}</Text>
            <Text>{catalog?.business.address}</Text>
          </View>
        )}
      />
    </View>
  )
}
