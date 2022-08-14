import { WarningIcon } from './Icons'

type DraftProps = {
  draft: boolean
  pageName?: string
}

export default function DraftBanner({ draft, pageName }: DraftProps) {
  return (
    <>
      {draft && (
        <div className='flex items-center gap-1 text-xs w-full px-4 py-4 backdrop-blur-sm bg-yellow-400/70'>
          <div className='w-5 h-5'>{<WarningIcon />}</div>
          {`This ${pageName || 'page'} is a draft and won't be published`}
        </div>
      )}
    </>
  )
}
