import { redirect, RedirectType } from 'next/navigation';

export default function HomeRedirect() {
  redirect('/', RedirectType.replace);
}
