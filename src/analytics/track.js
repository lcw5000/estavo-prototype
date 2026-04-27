// Estavo Analytics — PostHog wrapper
//
// Structured for easy migration to RudderStack:
// Only the primitives section (initAnalytics, track, trackPage, identifyAgent)
// needs to change. All named event functions below are SDK-agnostic.
//
// Required env vars:
//   VITE_POSTHOG_KEY      — project API key (phc_...)
//   VITE_POSTHOG_HOST     — https://us.i.posthog.com

import posthog from 'posthog-js'

const KEY  = import.meta.env.VITE_POSTHOG_KEY
const HOST = import.meta.env.VITE_POSTHOG_HOST
const DEV  = import.meta.env.DEV

// ── Primitives (swap these out when migrating to RudderStack) ─────────────────

export function initAnalytics() {
  if (!KEY || !HOST) {
    if (DEV) console.info('[analytics] no credentials — events logged to console only')
    return
  }
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false,   // we fire page events manually for full control
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: false,    // prototype — see everything
    },
  })
}

function track(event, props = {}) {
  if (posthog.__loaded) {
    posthog.capture(event, props)
  } else if (DEV) {
    console.log(`%c[track] ${event}`, 'color:#C84B2F;font-weight:bold', props)
  }
}

export function trackPage(name, props = {}) {
  if (posthog.__loaded) {
    posthog.capture('$pageview', { page_name: name, ...props })
  } else if (DEV) {
    console.log(`%c[page] ${name}`, 'color:#1A5C4A;font-weight:bold', props)
  }
}

export function identifyAgent(agentId, traits = {}) {
  if (posthog.__loaded) {
    posthog.identify(agentId, traits)
  } else if (DEV) {
    console.log(`%c[identify] ${agentId}`, 'color:#2B4FA0;font-weight:bold', traits)
  }
}

// ── Named events (never change these during a migration) ─────────────────────

export const analytics = {

  // ── Leads ──────────────────────────────────────────────────────────────────

  leadContacted: ({ leadId, source, contactId, channelUsed, responseMinutes }) =>
    track('lead_contacted', { lead_id: leadId, source, contact_id: contactId, channel: channelUsed, response_minutes: responseMinutes }),

  leadQualified: ({ leadId, contactId, source }) =>
    track('lead_qualified', { lead_id: leadId, contact_id: contactId, source }),

  automationPlaybookViewed: () =>
    track('automation_playbook_viewed'),

  // ── Contacts ───────────────────────────────────────────────────────────────

  contactViewed: ({ contactId, contactType, score }) =>
    track('contact_viewed', { contact_id: contactId, contact_type: contactType, score }),

  contactTabSwitched: ({ contactId, tab }) =>
    track('contact_tab_switched', { contact_id: contactId, tab }),

  messageSent: ({ contactId, channel }) =>
    track('message_sent', { contact_id: contactId, channel }),

  aiDraftOpened: ({ contactId }) =>
    track('ai_draft_opened', { contact_id: contactId }),

  aiDraftSent: ({ contactId }) =>
    track('ai_draft_sent', { contact_id: contactId }),

  convertToTransactionStarted: ({ contactId }) =>
    track('convert_to_transaction_started', { contact_id: contactId }),

  convertToTransactionCompleted: ({ contactId, transactionType, estimatedPrice }) =>
    track('convert_to_transaction_completed', { contact_id: contactId, transaction_type: transactionType, estimated_price: estimatedPrice }),

  // ── Transactions ───────────────────────────────────────────────────────────

  transactionViewed: ({ transactionId, stage }) =>
    track('transaction_viewed', { transaction_id: transactionId, stage }),

  // ── Showings ───────────────────────────────────────────────────────────────

  showingScheduled: ({ contactId, address }) =>
    track('showing_scheduled', { contact_id: contactId, address }),

  showingStatusUpdated: ({ showingId, status }) =>
    track('showing_status_updated', { showing_id: showingId, status }),

  // ── Calendar ───────────────────────────────────────────────────────────────

  taskAdded: ({ text }) =>
    track('task_added', { task_text: text }),

  taskCompleted: ({ taskId }) =>
    track('task_completed', { task_id: String(taskId) }),

  calendarMonthNavigated: ({ year, month, direction }) =>
    track('calendar_month_navigated', { year, month, direction }),

  // ── Campaigns ──────────────────────────────────────────────────────────────

  campaignViewed: ({ campaignId, campaignName }) =>
    track('campaign_viewed', { campaign_id: campaignId, campaign_name: campaignName }),

  campaignActionTaken: ({ campaignId, action }) =>
    track('campaign_action_taken', { campaign_id: campaignId, action }),

  // ── IDX Site ───────────────────────────────────────────────────────────────

  idxLeadAddedToCrm: ({ captureId, area, budget }) =>
    track('idx_lead_added_to_crm', { capture_id: captureId, area, budget }),

  idxTabViewed: ({ tab }) =>
    track('idx_tab_viewed', { tab }),

  // ── Cap Tracker ────────────────────────────────────────────────────────────

  capTrackerViewed: () =>
    track('cap_tracker_viewed'),

  // ── Analytics page ─────────────────────────────────────────────────────────

  analyticsPageViewed: () =>
    track('analytics_page_viewed'),

  // ── AI features ────────────────────────────────────────────────────────────

  quickActionUsed: ({ action }) =>
    track('quick_action_used', { action }),

  // ── Settings ───────────────────────────────────────────────────────────────

  settingsChanged: ({ setting, value }) =>
    track('settings_changed', { setting, value }),
}
