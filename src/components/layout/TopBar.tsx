import { Bell, Search } from 'lucide-react'

export function TopBar() {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: 52,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left spacer — fills sidebar width dynamically via parent flex */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search icon */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors hover:bg-gray-100"
          style={{ color: '#9CA3AF' }}
          aria-label="Search"
        >
          <Search size={15} />
        </button>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors hover:bg-gray-100"
          style={{ color: '#9CA3AF' }}
          aria-label="Notifications"
        >
          <Bell size={15} />
        </button>

        {/* Divider */}
        <span className="w-px h-5" style={{ background: '#E5E7EB' }} />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>Mohamed</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.2 }}>azarufin020@gmail.com · admin</p>
          </div>
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 text-white select-none cursor-pointer"
            style={{
              width: 32,
              height: 32,
              background: '#111827',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            M
          </div>
        </div>
      </div>
    </header>
  )
}
