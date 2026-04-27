// Estavo Analytics — RudderStack wrapper
// Events flow: app → RudderStack Cloud → BigQuery
//
// To activate: set VITE_RUDDERSTACK_WRITE_KEY and VITE_RUDDERSTACK_DATA_PLANE_URL
// in .env (local) and Vercel environment variables (production).
// All calls are no-ops until those vars are present.

import * as rudder from 'rudder-sdk-js'

const WRITE_KEY      = import.meta.env.VITE_RUDDERSTACK_WRITE_KEY
const DATA_PLANE_URL = import.meta.env.VITE_RUDDERSTACK_DATA_PLANE_URL
const IS_DEV         = import.meta.env.DEV

let ready = false

export function initAnalytics() {
  if (!WRITE_KEY || !DATA_PLANE_URL) {
    if (IS_DEV) console.info('[analytics] no credentials — events logged to console only')
    return
  }
  rudder.load(WRITE_KEY, DATA_PLANE_URL, { logLevel: 'ERROR' })
  rudder.ready(() => { ready = true })
}

// ── Core primitives ──────────────────────────────────────────────────────────

function track(event, props = {}) {
  const payload = { ...props, platform: 'web', env: IS_DEV ? 'dev' : 'prod' }
  if (ready) {
    rudder.track(event, payload)
  } else if (IS_DEV) {
    console.log(`%c[track] ${event}`, 'color:#C84B2F;font-weight:bold', payload)
  }
}

export function trackPage(name, props = {}) {
  if (ready) {
    rudder.page('App', name, props)
  } else if (IS_DEV) {
    console.log(`%c[page] ${name}`, 'color:#1A5C4A;font-weight:bold', props)
  }
}

export function identifyAgent(agentId, traits = {}) {
  if (ready) {
    rudder.identify(agentId, traits)
  } else if (IS_DEV) {
    console.log(`%c[identify] ${agentId}`, 'color:#2B4FA0;font-weight:bold', traits)
  }
}

// ── Named events ─────────────────────────────────────────────────────────────
// One function per event keeps the schema explicit and searchable.

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
    track('task_completed', { task_id: taskId }),

  calendarMonthNavigated: ({ year, month, direction }) =>
    track('calendar_month_navigated', { year, month, direction }),

  // ── Campaigns ──────────────────────────────────────────────────────────────

  campaignViewed: ({ campaignId, campaignName }) =>
    track('campaign_viewed', { campaign_id: campaignId, campaign_name: campaignName }),

  campaignActionTaken: ({ campaignId, action }) =>
    track('campaign_action_taken', { campaign_id: campaignId, action }),

  // ── IDX Site ───────────────────────────────────────────────────────────────

  idxLeadAddedToCrm: ({ captureId, name, area, budget }) =>
    track('idx_lead_added_to_crm', { capture_id: captureId, area, budget }),

  idxTabViewed: ({ tab }) =>
    track('idx_tab_viewed', { tab }),

  // ── Cap Tracker / Commission ────────────────────────────────────────────────

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
