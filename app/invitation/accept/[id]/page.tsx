import { redirect } from 'next/navigation';

export default function OldInvitePage({
    params
}: {
    params: { id: string }
}) {
    redirect(`/invite/${params.id}`);
}