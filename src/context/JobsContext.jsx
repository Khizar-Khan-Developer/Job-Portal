import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const JobsContext = createContext(null)
const STORAGE_KEY = 'careerly-saved-jobs'

export function JobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs))
  }, [savedJobs])

  const toggleSaved = (job) => {
    setSavedJobs(current => current.some(item => item.id === job.id)
      ? current.filter(item => item.id !== job.id)
      : [...current, job])
  }
  const isSaved = id => savedJobs.some(job => job.id === id)
  const value = useMemo(() => ({ savedJobs, toggleSaved, isSaved }), [savedJobs])
  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
}

export function useJobs() {
  const context = useContext(JobsContext)
  if (!context) throw new Error('useJobs must be used inside JobsProvider')
  return context
}