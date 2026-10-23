import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useJobs } from './context/JobsContext'
import { demoJobs } from './data/demoJobs'

const PAGE_SIZE = 6
const categories = ['Technology', 'Design', 'Marketing', 'Data & Analytics', 'Customer Support', 'Human Resources', 'Operations', 'Finance']

function Header() {
  const { savedJobs } = useJobs()
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="brand" to="/"><span className="brand-mark"><i className="bi bi-compass-fill" /></span> careerly<span className="brand-dot">.</span></Link>
      <nav className="main-nav">
        <NavLink to="/" end>Find jobs</NavLink>
        <a href="/#companies">Companies</a>
        <a href="/#resources">Career advice</a>
      </nav>
      <div className="header-actions">
        <Link className="saved-link" to="/saved"><i className="bi bi-bookmark" /> Saved <span className="saved-count">{savedJobs.length}</span></Link>
        <a className="btn btn-dark header-cta" href="#browse" onClick={e => { if (window.location.pathname !== '/') { e.preventDefault(); window.location.href = '/#browse' } }}>Explore jobs <i className="bi bi-arrow-up-right" /></a>
      </div>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer" id="resources"><div className="container footer-inner">
    <div><Link className="brand footer-brand" to="/"><span className="brand-mark"><i className="bi bi-compass-fill" /></span> careerly<span className="brand-dot">.</span></Link><p>Good work starts with the right opportunity.</p></div>
    <div className="footer-right"><span>Made for the next step in your career.</span><span>© {new Date().getFullYear()} Careerly</span></div>
  </div></footer>
}

function JobLogo({ job, large = false }) {
  return <div className={`company-logo ${large ? 'company-logo-lg' : ''}`} style={{ background: job.logoBg || '#e6efff', color: job.logoColor || '#3159bd' }}>{job.initials || (job.company || 'C').slice(0, 2).toUpperCase()}</div>
}

function JobCard({ job }) {
  const { toggleSaved, isSaved } = useJobs()
  const saved = isSaved(job.id)
  return <article className="job-card">
    <div className="job-card-top"><JobLogo job={job} /><button className={`bookmark-btn ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove saved job' : 'Save job'} onClick={() => toggleSaved(job)}><i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} /></button></div>
    <div className="job-company">{job.company} <span className="verified"><i className="bi bi-patch-check-fill" /></span><span className="posted">· {job.posted}</span></div>
    <h3><Link to={`/jobs/${encodeURIComponent(job.id)}`}>{job.title}</Link></h3>
    <div className="job-meta"><span><i className="bi bi-geo-alt" /> {job.location}</span><span><i className="bi bi-briefcase" /> {job.jobType}</span></div>
    <p className="job-excerpt">{job.description}</p>
    <div className="job-card-bottom"><div className="salary">{job.salary}<small>Estimated salary</small></div><Link className="round-arrow" to={`/jobs/${encodeURIComponent(job.id)}`} aria-label={`View ${job.title}`}><i className="bi bi-arrow-up-right" /></Link></div>
  </article>
}

function LoadingState() {
  return <div className="loading-state"><div className="spinner-border text-primary" role="status" /><p>Finding great opportunities…</p></div>
}

function HomePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState('demo')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('All types')
  const [category, setCategory] = useState('All categories')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let active = true
    async function loadJobs() {
      setLoading(true); setError('')
      try {
        const response = await fetch('https://www.arbeitnow.com/api/job-board-api')
        if (!response.ok) throw new Error('Job service is temporarily unavailable.')
        const payload = await response.json()
        const apiJobs = (payload.data || []).map((job, i) => ({
          id: `api-${job.slug || job.id || i}`,
          title: job.title || 'Untitled role',
          company: job.company_name || 'Company',
          location: job.location || 'Location not specified',
          jobType: job.job_types?.[0] ? job.job_types[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : (job.remote ? 'Remote' : 'Full-time'),
          category: job.tags?.[0] || 'Other',
          salary: job.salary || 'Not disclosed',
          level: 'All levels',
          initials: (job.company_name || 'CO').split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase(),
          logoBg: ['#e6efff','#fce9dd','#dcf5e9','#f2e7ff'][i % 4],
          logoColor: ['#3159bd','#b75c2c','#21835c','#7b42b5'][i % 4],
          posted: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently',
          description: (job.description || 'Explore this opportunity and learn more about the role.').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 450),
          rawDescription: job.description || '',
          url: job.url || '',
          tags: job.tags || [],
          responsibilities: ['Work collaboratively to deliver the responsibilities of this role.', 'Communicate progress and contribute to team goals.', 'Learn, improve, and share knowledge with teammates.'],
          requirements: job.tags?.length ? job.tags : ['Relevant experience or demonstrable skills', 'Strong communication and problem-solving skills']
        }))
        if (active && apiJobs.length) { setJobs(apiJobs); setApiStatus('live') }
        else if (active) { setJobs(demoJobs); setApiStatus('demo') }
      } catch {
        if (active) { setJobs(demoJobs); setApiStatus('demo'); setError('Live listings could not be reached, so sample jobs are shown instead.') }
      } finally { if (active) setLoading(false) }
    }
    loadJobs()
    return () => { active = false }
  }, [])

  const filteredJobs = useMemo(() => jobs.filter(job => {
    const q = search.trim().toLowerCase()
    const searchMatch = !q || [job.title, job.company, job.description, ...(job.tags || [])].join(' ').toLowerCase().includes(q)
    const locationMatch = !location.trim() || job.location.toLowerCase().includes(location.trim().toLowerCase()) || (location.toLowerCase() === 'remote' && /remote|anywhere/i.test(job.location))
    const typeMatch = jobType === 'All types' || job.jobType.toLowerCase().includes(jobType.toLowerCase())
    const categoryMatch = category === 'All categories' || job.category.toLowerCase().includes(category.toLowerCase()) || (job.tags || []).some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    return searchMatch && locationMatch && typeMatch && categoryMatch
  }), [jobs, search, location, jobType, category])

  useEffect(() => setPage(1), [search, location, jobType, category])
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const visibleJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const resetFilters = () => { setSearch(''); setLocation(''); setJobType('All types'); setCategory('All categories') }

  return <>
    <section className="hero"><div className="hero-glow glow-one" /><div className="hero-glow glow-two" /><div className="container hero-content">
      <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
      <h1>Find work that<br /> <span>moves you forward.</span></h1>
      <p className="hero-subtitle">Discover roles where your talent meets opportunity.<br className="desktop-break" /> Your next great move is closer than you think.</p>
      <div className="hero-stats"><div><strong>1,200<span>+</span></strong><small>Open opportunities</small></div><div className="stat-divider" /><div><strong>350<span>+</span></strong><small>Growing companies</small></div><div className="stat-divider" /><div><strong>92<span>%</span></strong><small>Candidate satisfaction</small></div></div>
      <a className="hero-scroll" href="#browse"><span><i className="bi bi-arrow-down" /></span> Explore open roles</a>
    </div><div className="hero-side-note">CAREERLY / OPPORTUNITY AWAITS</div></section>

    <section className="search-section" id="browse"><div className="container">
      <div className="search-panel">
        <div className="search-field"><i className="bi bi-search" /><div><label htmlFor="search-job">What are you looking for?</label><input id="search-job" value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, skill or company" /></div></div>
        <div className="search-separator" />
        <div className="search-field location-field"><i className="bi bi-geo-alt" /><div><label htmlFor="search-location">Where?</label><input id="search-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="City or remote" /></div></div>
        <button className="btn btn-primary search-button" onClick={() => document.getElementById('job-results')?.scrollIntoView({ behavior: 'smooth' })}>Search jobs <i className="bi bi-arrow-right" /></button>
      </div>
      <div className="popular-searches"><span>Popular:</span>{['React Developer','Remote','Design','Marketing'].map(term => <button key={term} onClick={() => term === 'Remote' ? setLocation('Remote') : setSearch(term)}>{term}</button>)}</div>
    </div></section>

    <section className="results-section" id="job-results"><div className="container">
      <div className="section-heading"><div><div className="section-kicker">CURATED FOR YOUR NEXT MOVE</div><h2>Explore opportunities<span>.</span></h2><p>Find the role that fits your ambition.</p></div><div className="results-heading-right"><span className="live-indicator" /><span>{loading ? 'Updating listings' : `${filteredJobs.length} roles found`}</span><button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><i className="bi bi-sliders" /> Filters</button></div></div>
      {showFilters && <div className="filter-panel">
        <div className="filter-control"><label htmlFor="type-filter">Job type</label><select id="type-filter" value={jobType} onChange={e => setJobType(e.target.value)}><option>All types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option></select></div>
        <div className="filter-control"><label htmlFor="category-filter">Category</label><select id="category-filter" value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select></div>
        <button className="clear-filters" onClick={resetFilters}><i className="bi bi-arrow-counterclockwise" /> Clear filters</button>
      </div>}
      {error && <div className="notice"><i className="bi bi-info-circle" /> {error}</div>}
      {apiStatus === 'live' && <div className="api-note"><i className="bi bi-broadcast" /> Showing live listings from the Arbeitnow Job Board API.</div>}
      {loading ? <LoadingState /> : visibleJobs.length ? <>
        <div className="job-grid">{visibleJobs.map(job => <JobCard key={job.id} job={job} />)}</div>
        <div className="pagination-row"><span>Showing <strong>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredJobs.length)}</strong> of <strong>{filteredJobs.length}</strong> jobs</span><div className="pagination-controls"><button disabled={page === 1} onClick={() => {setPage(p => p - 1); document.getElementById('job-results')?.scrollIntoView({behavior:'smooth'})}} aria-label="Previous page"><i className="bi bi-chevron-left" /></button>{Array.from({length: totalPages}, (_, i) => i + 1).slice(Math.max(0, Math.min(page - 2, totalPages - 3)), Math.max(3, Math.min(page + 1, totalPages))).map(n => <button className={page === n ? 'current' : ''} key={n} onClick={() => setPage(n)}>{n}</button>)}<button disabled={page === totalPages} onClick={() => {setPage(p => p + 1); document.getElementById('job-results')?.scrollIntoView({behavior:'smooth'})}} aria-label="Next page"><i className="bi bi-chevron-right" /></button></div></div>
      </> : <div className="empty-state"><div className="empty-icon"><i className="bi bi-search" /></div><h3>No jobs found just yet</h3><p>Try a different keyword or clear your filters to see more opportunities.</p><button className="btn btn-primary" onClick={resetFilters}>Clear all filters</button></div>}
    </div></section>

    <section className="cta-section" id="companies"><div className="container cta-box"><div className="cta-orb"><i className="bi bi-send-fill" /></div><div><div className="section-kicker">YOUR FUTURE IS CALLING</div><h2>A better career starts<br className="desktop-break" /> with one click.</h2><p>Save the roles you love and take the next step when you're ready.</p></div><a href="#browse" className="btn btn-dark cta-button">Find your next role <i className="bi bi-arrow-up-right" /></a><div className="cta-decoration">NEXT<br />CHAPTER</div></div></section>
  </>
}

function JobDetailPage() {
  const { id } = useParams()
  const { toggleSaved, isSaved } = useJobs()
  const [jobs, setJobs] = useState(demoJobs)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    fetch('https://www.arbeitnow.com/api/job-board-api').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (!active) return
      const apiJobs = (data.data || []).map((job, i) => ({
        id: `api-${job.slug || job.id || i}`, title: job.title || 'Untitled role', company: job.company_name || 'Company',
        location: job.location || 'Location not specified', jobType: job.job_types?.[0] || (job.remote ? 'Remote' : 'Full-time'),
        category: job.tags?.[0] || 'Other', salary: job.salary || 'Not disclosed', level: 'All levels',
        initials: (job.company_name || 'CO').split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase(),
        logoBg: '#e6efff', logoColor: '#3159bd', posted: 'Recently',
        description: (job.description || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,500),
        rawDescription: job.description || '', url: job.url || '', tags: job.tags || [],
        responsibilities: ['Contribute to team goals and deliver quality work.','Collaborate with teammates and stakeholders.','Communicate clearly and keep learning.'],
        requirements: job.tags?.length ? job.tags : ['Relevant skills and experience','Strong communication and problem-solving skills']
      }))
      if (apiJobs.length) setJobs([...apiJobs, ...demoJobs])
    }).catch(() => {}).finally(() => { if(active) setLoading(false) })
    return () => { active = false }
  }, [])
  const job = jobs.find(item => item.id === id)
  const saved = job ? isSaved(job.id) : false
  if (loading && !job) return <div className="container page-space"><LoadingState /></div>
  if (!job) return <div className="container page-space"><div className="empty-state"><div className="empty-icon"><i className="bi bi-file-earmark-x" /></div><h3>We couldn't find that role</h3><p>This listing may have expired or moved.</p><Link className="btn btn-primary" to="/">Back to jobs</Link></div></div>
  return <section className="detail-section"><div className="container detail-container"><Link className="back-link" to="/"><i className="bi bi-arrow-left" /> Back to all jobs</Link>
    <div className="detail-layout"><main><div className="detail-company-head"><JobLogo job={job} large /><div><div className="job-company">{job.company} <span className="verified"><i className="bi bi-patch-check-fill" /></span></div><h1>{job.title}</h1><div className="job-meta"><span><i className="bi bi-geo-alt" /> {job.location}</span><span><i className="bi bi-briefcase" /> {job.jobType}</span><span><i className="bi bi-clock" /> {job.posted}</span></div></div></div>
    <div className="detail-tags">{(job.tags?.length ? job.tags.slice(0,4) : [job.category, job.level, job.jobType]).map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className="detail-content"><h2>About the role</h2>{job.rawDescription ? <div className="api-description" dangerouslySetInnerHTML={{__html: job.rawDescription}} /> : <p>{job.description}</p>}<h2>What you'll do</h2><ul>{job.responsibilities.map(item => <li key={item}>{item}</li>)}</ul><h2>What we're looking for</h2><ul>{job.requirements.map(item => <li key={item}>{item}</li>)}</ul><div className="detail-note"><i className="bi bi-lightbulb" /><div><strong>Tip for applicants</strong><p>Tailor your CV to this role and highlight relevant projects, measurable results, and skills.</p></div></div></div>
    </main><aside className="apply-card"><div className="section-kicker">THE OPPORTUNITY</div><div className="apply-salary">{job.salary}<small>Estimated compensation</small></div><div className="apply-fact"><i className="bi bi-geo-alt" /><div><small>Location</small><strong>{job.location}</strong></div></div><div className="apply-fact"><i className="bi bi-briefcase" /><div><small>Employment</small><strong>{job.jobType}</strong></div></div><div className="apply-fact"><i className="bi bi-bar-chart" /><div><small>Experience</small><strong>{job.level || 'All levels'}</strong></div></div><Link className="btn btn-primary apply-button" to={`/apply/${encodeURIComponent(job.id)}`} onClick={() => sessionStorage.setItem('careerly-current-jobs', JSON.stringify([job]))}>Apply for this role <i className="bi bi-arrow-up-right" /></Link><button className={`save-detail ${saved ? 'saved' : ''}`} onClick={() => toggleSaved(job)}><i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} /> {saved ? 'Saved to your list' : 'Save this job'}</button>{job.url && <a className="external-apply" href={job.url} target="_blank" rel="noreferrer">View original listing <i className="bi bi-box-arrow-up-right" /></a>}<p className="apply-disclaimer"><i className="bi bi-shield-check" /> Review the listing details before sharing personal information.</p></aside></div>
  </div></section>
}

function ApplyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(demoJobs)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', portfolio: '', coverLetter: '', consent: false })
  useEffect(() => { try { const stored = JSON.parse(sessionStorage.getItem('careerly-current-jobs') || 'null'); if (stored) setJobs([...stored, ...demoJobs]) } catch {} }, [])
  const job = jobs.find(item => item.id === id)
  const update = e => { const { name, value, type, checked } = e.target; setForm(f => ({...f, [name]: type === 'checkbox' ? checked : value})) }
  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.'
    else if (form.fullName.trim().length < 2) next.fullName = 'Name must be at least 2 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!/^[+\d\s().-]{7,20}$/.test(form.phone)) next.phone = 'Enter a valid phone number.'
    if (form.portfolio && !/^https?:\/\/.+\..+/.test(form.portfolio)) next.portfolio = 'Include a valid link starting with http:// or https://.'
    if (form.coverLetter.trim().length < 30) next.coverLetter = 'Please write at least 30 characters.'
    if (!form.consent) next.consent = 'Please confirm your information is accurate.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const submit = e => {
    e.preventDefault()
    if (!validate()) return
    const application = { ...form, jobId: id, jobTitle: job?.title || 'Job role', submittedAt: new Date().toISOString() }
    const old = JSON.parse(localStorage.getItem('careerly-applications') || '[]')
    localStorage.setItem('careerly-applications', JSON.stringify([...old, application]))
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (!job) return <div className="container page-space"><div className="empty-state"><h3>Job not found</h3><Link className="btn btn-primary" to="/">Browse jobs</Link></div></div>
  if (submitted) return <section className="form-page"><div className="container form-container"><div className="success-card"><div className="success-icon"><i className="bi bi-check2" /></div><div className="section-kicker">APPLICATION SAVED</div><h1>You're one step closer.</h1><p>Your application for <strong>{job.title}</strong> has been saved in this browser for the assignment demo.</p><div className="success-summary"><span>Applicant</span><strong>{form.fullName}</strong><span>Email</span><strong>{form.email}</strong><span>Role</span><strong>{job.title}</strong></div><p className="muted-small">Demo note: this frontend stores the application locally. It does not send your details to the employer.</p><Link to="/" className="btn btn-primary">Back to job listings <i className="bi bi-arrow-right" /></Link></div></div></section>
  return <section className="form-page"><div className="container form-container"><Link className="back-link" to={`/jobs/${encodeURIComponent(job.id)}`}><i className="bi bi-arrow-left" /> Back to job details</Link><div className="form-layout"><div className="form-intro"><div className="section-kicker">TAKE THE NEXT STEP</div><h1>Make your next move.</h1><p>Share a little about yourself. A thoughtful application can help your experience stand out.</p><div className="form-role-card"><JobLogo job={job} /><div><strong>{job.title}</strong><span>{job.company} · {job.location}</span></div></div><div className="privacy-note"><i className="bi bi-lock" /><span>Your details stay in this browser for this demo. No application is sent to an employer.</span></div></div><form className="application-form" onSubmit={submit} noValidate><div className="form-card-heading"><h2>Application details</h2><p>Fields marked with * are required.</p></div>
    <div className="form-field"><label htmlFor="fullName">Full name <b>*</b></label><input id="fullName" name="fullName" value={form.fullName} onChange={update} placeholder="e.g. Alex Morgan" className={errors.fullName?'invalid':''} />{errors.fullName && <small className="field-error">{errors.fullName}</small>}</div>
    <div className="form-row"><div className="form-field"><label htmlFor="email">Email address <b>*</b></label><input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" className={errors.email?'invalid':''} />{errors.email && <small className="field-error">{errors.email}</small>}</div><div className="form-field"><label htmlFor="phone">Phone number <b>*</b></label><input id="phone" name="phone" value={form.phone} onChange={update} placeholder="+92 300 1234567" className={errors.phone?'invalid':''} />{errors.phone && <small className="field-error">{errors.phone}</small>}</div></div>
    <div className="form-field"><label htmlFor="portfolio">Portfolio / LinkedIn <span>(optional)</span></label><input id="portfolio" name="portfolio" value={form.portfolio} onChange={update} placeholder="https://linkedin.com/in/yourname" className={errors.portfolio?'invalid':''} />{errors.portfolio && <small className="field-error">{errors.portfolio}</small>}</div>
    <div className="form-field"><label htmlFor="coverLetter">Why are you a good fit? <b>*</b></label><textarea id="coverLetter" name="coverLetter" value={form.coverLetter} onChange={update} rows="5" placeholder="Tell us about your relevant experience, skills, and what interests you about this role…" className={errors.coverLetter?'invalid':''} /> <div className="field-bottom"><small>Minimum 30 characters</small><small>{form.coverLetter.length} characters</small></div>{errors.coverLetter && <small className="field-error">{errors.coverLetter}</small>}</div>
    <label className={`consent-row ${errors.consent?'consent-error':''}`}><input type="checkbox" name="consent" checked={form.consent} onChange={update} /><span>I confirm that the information provided is accurate. <b>*</b></span></label>{errors.consent && <small className="field-error">{errors.consent}</small>}
    <button type="submit" className="btn btn-primary submit-application">Submit application <i className="bi bi-arrow-right" /></button><p className="form-terms">By submitting, you agree to share these details for this demo application.</p>
  </form></div></div></section>
}

function SavedPage() {
  const { savedJobs } = useJobs()
  return <section className="saved-page"><div className="container"><div className="section-kicker">YOUR SHORTLIST</div><h1 className="saved-title">Saved opportunities<span>.</span></h1><p className="saved-subtitle">Keep the roles you're interested in close at hand.</p>{savedJobs.length ? <><div className="saved-summary"><i className="bi bi-bookmark-check" /> You have saved {savedJobs.length} {savedJobs.length === 1 ? 'role' : 'roles'}.</div><div className="job-grid">{savedJobs.map(job => <JobCard key={job.id} job={job} />)}</div></> : <div className="empty-state saved-empty"><div className="empty-icon"><i className="bi bi-bookmark" /></div><h3>Your next opportunity starts here</h3><p>Save roles that catch your eye and they'll appear here.</p><Link className="btn btn-primary" to="/">Explore jobs <i className="bi bi-arrow-right" /></Link></div>}</div></section>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return <><ScrollToTop /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/jobs/:id" element={<JobDetailPage />} /><Route path="/apply/:id" element={<ApplyPage />} /><Route path="/saved" element={<SavedPage />} /><Route path="*" element={<div className="container page-space empty-state"><h3>Page not found</h3><Link className="btn btn-primary" to="/">Go home</Link></div>} /></Routes><Footer /></>
}