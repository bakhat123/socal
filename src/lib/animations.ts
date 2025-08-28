export const animateStats = () => {
  const statElements = document.querySelectorAll('.stat-number')
  const speed = 200 // lower = faster
  
  statElements.forEach((stat) => {
    const target = +(stat.getAttribute('data-target') || 0)
    const count = +(stat.textContent?.replace(/[^0-9.]/g, '') || 0)
    const increment = target / speed
    
    if (count < target) {
      stat.textContent = Math.ceil(count + increment).toString()
      setTimeout(animateStats, 1)
    } else {
      const suffix = stat.getAttribute('data-suffix')
      stat.textContent = target.toString() + (suffix || '')
    }
  })
}

export const observeStatsSection = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats()
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  const statsSection = document.querySelector('.stats-section')
  if (statsSection) observer.observe(statsSection)

  return () => observer.disconnect()
}