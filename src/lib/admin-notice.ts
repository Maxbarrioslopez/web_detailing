export type AdminNoticeType = 'success' | 'error'

export const withAdminNotice = (
  path: string,
  type: AdminNoticeType,
  message: string,
) => {
  const url = new URL(path, 'http://localhost')

  url.searchParams.set('notice', message)
  url.searchParams.set('noticeType', type)

  return `${url.pathname}${url.search}`
}
