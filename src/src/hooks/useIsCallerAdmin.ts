import { useInternetIdentity } from './useInternetIdentity'

export function useIsCallerAdmin() {
  const { identity } = useInternetIdentity()

  // For now, treat any non-null identity in dev as admin.
  return {
    data: identity ? true : false,
    isFetched: true,
    isLoading: false,
    refetch: async () => {},
  }
}

export default useIsCallerAdmin
