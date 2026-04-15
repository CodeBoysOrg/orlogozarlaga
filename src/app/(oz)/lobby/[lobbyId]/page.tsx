import LobbyDashboardScreen from "@/features/lobby/LobbyDashboardScreen";

type LobbyDashboardPageProps = {
  params: Promise<{
    lobbyId: string;
  }>;
};

export default async function LobbyDashboardPage({
  params,
}: LobbyDashboardPageProps) {
  const { lobbyId } = await params;
  return <LobbyDashboardScreen lobbyId={lobbyId} />;
}
