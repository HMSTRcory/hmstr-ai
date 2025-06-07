'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

interface TopMetricsProps {
  dateRange: DateRange | undefined
}

interface MetricResult {
  qualified_leads: number | null
  qualified_leads_ppc: number | null
  qualified_leads_lsa: number | null
  qualified_leads_seo: number | null
  spend_ppc: number | null
  spend_lsa: number | null
  spend_seo: number | null
  spend_total: number | null
  cpql_ppc: number | null
  cpql_lsa: number | null
  cpql_seo: number | null
  cpql_total: number | null
}

export default function TopMetrics({ dateRange }: TopMetricsProps) {
  const supabase = createClientComponentClient()
  const [data, setData] = useState<MetricResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      if (!dateRange?.from || !dateRange?.to) return

      setLoading(true)
      const { data, error } = await supabase.rpc('get_top_metrics', {
        input_client_id: 20,
        input_start_date: format(dateRange.from, 'yyyy-MM-dd'),
        input_end_date: format(dateRange.to, 'yyyy-MM-dd')
      })

      if (error) {
        console.error('Supabase RPC error:', error)
        setData(null)
      } else {
        setData(data)
      }

      setLoading(false)
    }

    fetchMetrics()
  }, [dateRange])

  const formatNumber = (value: number | null) =>
    value === null ? '–' : value.toFixed(0)

  const formatCurrency = (value: number | null) =>
    value === null ? '–' : `$${value.toFixed(0)}`

  const formatCPQL = (value: number | null) =>
    value === null ? '–' : `$${value.toFixed(2)}`

  return (
    <div className="bg-white p-6 rounded shadow-md">
      {dateRange?.from && dateRange?.to && (
        <p className="mb-4 text-gray-700">
          {format(dateRange.from, 'MM/dd/yyyy')} - {format(dateRange.to, 'MM/dd/yyyy')}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-1 text-gray-900">
          <p>Leads Total: {formatNumber(data?.qualified_leads)}</p>
          <p>Leads PPC: {formatNumber(data?.qualified_leads_ppc)}</p>
          <p>Leads LSA: {formatNumber(data?.qualified_leads_lsa)}</p>
          <p>Leads SEO: {formatNumber(data?.qualified_leads_seo)}</p>

          <p className="mt-4">Spend PPC: {formatCurrency(data?.spend_ppc)}</p>
          <p>Spend LSA: {formatCurrency(data?.spend_lsa)}</p>
          <p>Spend SEO: {formatCurrency(data?.spend_seo)}</p>
          <p>Spend Total: {formatCurrency(data?.spend_total)}</p>

          <p className="mt-4">CPQL PPC: {formatCPQL(data?.cpql_ppc)}</p>
          <p>CPQL LSA: {formatCPQL(data?.cpql_lsa)}</p>
          <p>CPQL SEO: {formatCPQL(data?.cpql_seo)}</p>
          <p>CPQL Total: {formatCPQL(data?.cpql_total)}</p>
        </div>
      )}
    </div>
  )
}
