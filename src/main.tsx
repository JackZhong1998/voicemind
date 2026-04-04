import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import { Root } from './Root.tsx';
import './index.css';

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {pk ? (
      <ClerkProvider publishableKey={pk} afterSignOutUrl="/">
        <Root />
      </ClerkProvider>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 font-sans text-center">
        <div className="max-w-md space-y-2 text-zinc-700">
          <p className="font-semibold">缺少 Clerk 配置</p>
          <p className="text-sm text-zinc-500">
            请在项目根目录 <code className="text-zinc-800">.env</code> 中设置{' '}
            <code className="text-zinc-800">VITE_CLERK_PUBLISHABLE_KEY</code>（来自 Clerk
            Dashboard → API Keys），然后重新启动开发服务器。
          </p>
        </div>
      </div>
    )}
  </StrictMode>,
);
