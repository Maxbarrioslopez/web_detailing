type AdminNoticeProps = {
  message?: string
  type?: string
}

const AdminNotice = ({ message, type }: AdminNoticeProps) => {
  if (!message) {
    return null
  }

  const isSuccess = type === 'success'

  return (
    <div
      className={[
        'rounded-[22px] border px-4 py-3 text-sm leading-7',
        isSuccess
          ? 'border-[rgba(197,154,90,0.22)] bg-[rgba(197,154,90,0.08)] text-[rgba(244,239,232,0.92)]'
          : 'border-[rgba(241,184,127,0.22)] bg-[rgba(241,184,127,0.08)] text-[#f7d0aa]',
      ].join(' ')}>
      {message}
    </div>
  )
}

export default AdminNotice
