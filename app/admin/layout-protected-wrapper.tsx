import AdminProtectedContent from './layout-protected';

export default function AdminProtectedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedContent>{children}</AdminProtectedContent>;
}
