'use client'
import React from 'react'
import { useApp } from '../lib/state'
import Hero from '../components/Hero'
import HowItWorksSlider from '../components/HowItWorksSlider'
import FeaturedContractors from '../components/FeaturedContractors'
import FeaturedJobs from '../components/FeaturedJobs'
import Testimonials from '../components/Testimonials'

export default function HomePage(){
  const { state } = useApp()
  const showJobsForContractor = state.user.signedIn && state.user.role === 'CONTRACTOR'

  return (
    <div className="space-y-10">
      <Hero />
      <HowItWorksSlider />

      {/* Homeowner view (default if not signed in) */}
      {!showJobsForContractor && <FeaturedContractors />}

      {/* Contractor view */}
      {showJobsForContractor && <FeaturedJobs />}

      {/* Testimonials */}
      <Testimonials />
    </div>
  )
}
