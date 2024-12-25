import React, { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const NotificationComponent = () => {
  useEffect(() => {
    const token = localStorage.getItem('authToken') // Token lấy từ hệ thống xác thực của bạn

    const socketUrl = `https://office-nest-ohcid.ondigitalocean.app/ws?token=${token}`

    const socket = new SockJS(socketUrl)

    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Đã kết nối đến WebSocket')

        // Đăng ký nhận thông báo chung
        stompClient.subscribe('/topic/notifications', (message) => {
          console.log('Thông báo chung:', message.body)
        })

        // Đăng ký nhận thông báo cá nhân
        stompClient.subscribe('/topic/notifications/1087', (message) => {
          console.log('Thông báo cá nhân:', message.body)
        })
      },
      onStompError: (frame) => {
        console.error('Lỗi STOMP:', frame.headers['message'])
      },
      reconnectDelay: 5000 // Tự động kết nối lại sau 5 giây nếu bị ngắt
    })

    stompClient.activate()

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate()
      }
    }
  }, [])

  return <div>Đang lắng nghe thông báo...</div>
}

export default NotificationComponent
