import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux'
import { store } from '@/redux/store';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Nạp bộ từ điển tiếng Việt
import relativeTime from 'dayjs/plugin/relativeTime'; // Plugin tính thời gian tương đối

// Kích hoạt plugin và cài đặt ngôn ngữ mặc định toàn cục là tiếng Việt
dayjs.extend(relativeTime);
dayjs.locale('vi');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
