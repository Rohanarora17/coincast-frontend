"use client";

import React, { useState } from "react";
import { CalendarIcon, LinkIcon, TagIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CampaignFormProps {
  onSubmit: (data: CampaignData) => void;
}

export interface CampaignData {
  zoraPostLink: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  keywords: string[];
  targetAudience: string;
  campaignGoals: string;
  platformPreferences: string[];
}

export const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [formData, setFormData] = useState<CampaignData>({
    zoraPostLink: "",
    budget: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    keywords: [],
    targetAudience: "",
    campaignGoals: "",
    platformPreferences: [],
  });

  const [keywordInput, setKeywordInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Your Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Zora Post Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zora Post Link
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={formData.zoraPostLink}
              onChange={(e) => setFormData({ ...formData, zoraPostLink: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              placeholder="https://zora.co/..."
              required
            />
          </div>
        </div>

        {/* Budget Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Budget (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
              className="block w-full pl-10 pr-3 py-2"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.budget}%
            </div>
          </div>
        </div>

        {/* Campaign Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={formData.startDate}
                onChange={(date: Date | null) => setFormData({ ...formData, startDate: date || new Date() })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                minDate={new Date()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={formData.endDate}
                onChange={(date: Date | null) => setFormData({ ...formData, endDate: date || new Date() })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                minDate={formData.startDate}
              />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keywords
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Add keywords..."
              />
            </div>
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience
          </label>
          <textarea
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder="Describe your target audience..."
            required
          />
        </div>

        {/* Campaign Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Goals
          </label>
          <textarea
            value={formData.campaignGoals}
            onChange={(e) => setFormData({ ...formData, campaignGoals: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder="What are your campaign goals?"
            required
          />
        </div>

        {/* Platform Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Preferences
          </label>
          <div className="space-y-2">
            {["Twitter", "Discord", "Telegram", "Reddit"].map((platform) => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.platformPreferences.includes(platform)}
                  onChange={(e) => {
                    const newPreferences = e.target.checked
                      ? [...formData.platformPreferences, platform]
                      : formData.platformPreferences.filter((p) => p !== platform);
                    setFormData({ ...formData, platformPreferences: newPreferences });
                  }}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
}; 