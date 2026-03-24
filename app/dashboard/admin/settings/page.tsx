"use client";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    churchName: "Hopewell Church",
    email: "info@hopewellchurch.com",
    phone: "+254712345678",
    address: "Nairobi, Kenya",
    website: "www.hopewellchurch.com",
    mpesaShortcode: "123456",
    twilioAccount: "AC****",
    stripeKey: "sk_live****",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // In a real app, this would save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Church Settings</h2>
        <p className="text-gray-600">Configure your church information and integrations</p>
      </div>

      {saved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-green-800">✓ Settings saved successfully</p>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Church details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="churchName">Church Name</Label>
              <Input
                id="churchName"
                value={settings.churchName}
                onChange={(e) =>
                  setSettings({ ...settings, churchName: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={settings.website}
                onChange={(e) =>
                  setSettings({ ...settings, website: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              className="w-full p-2 border rounded-md"
              rows={3}
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Integration</CardTitle>
          <CardDescription>Configure payment gateways for donations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              API keys are encrypted and stored securely
            </p>
          </div>

          <div>
            <Label htmlFor="mpesa">M-Pesa Shortcode</Label>
            <Input
              id="mpesa"
              value={settings.mpesaShortcode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  mpesaShortcode: e.target.value,
                })
              }
              placeholder="Business Shortcode"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your M-Pesa business shortcode for receiving payments
            </p>
          </div>

          <div>
            <Label htmlFor="stripe">Stripe API Key</Label>
            <Input
              id="stripe"
              type="password"
              value={settings.stripeKey}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  stripeKey: e.target.value,
                })
              }
              placeholder="sk_live_..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Your Stripe secret key for card payments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Communication Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Integration</CardTitle>
          <CardDescription>Configure SMS and email services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="twilio">Twilio Account SID</Label>
            <Input
              id="twilio"
              type="password"
              value={settings.twilioAccount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  twilioAccount: e.target.value,
                })
              }
              placeholder="ACxxxxxxxx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for sending SMS notifications
            </p>
          </div>

          <div>
            <Label htmlFor="resend">Resend API Key</Label>
            <Input
              id="resend"
              type="password"
              defaultValue="re_****"
              placeholder="re_xxxxx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for sending email communications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system behavior and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded"
              />
              <span>Allow member self-registration</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded"
              />
              <span>Require email verification</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded"
              />
              <span>Enable prayer request moderation</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
              />
              <span>Maintenance mode</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            Export Database
          </Button>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            Reset All Data
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
