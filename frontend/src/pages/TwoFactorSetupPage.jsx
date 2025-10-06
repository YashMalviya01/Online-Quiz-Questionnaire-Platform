import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { useToast } from '../components/ui/Toast';
import { Spinner, LoadingScreen } from '../components/ui/Loading';
import { Badge } from '../components/ui/Badge';
import { AlertCircle, CheckCircle2, Copy, Download, KeyRound, Shield } from 'lucide-react';
import QRCode from 'qrcode';

export default function TwoFactorSetupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Backup Codes
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  useEffect(() => {
    setup2FA();
  }, []);

  const setup2FA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setManualKey(data.manualEntryKey);
        setStep(1);
      } else {
        toast.error(data.message || 'Failed to setup 2FA');
        navigate('/settings');
      }
    } catch (error) {
      toast.error('Failed to setup 2FA');
      navigate('/settings');
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await response.json();

      if (response.ok) {
        setBackupCodes(data.backupCodes);
        setStep(3);
        toast.success('2FA enabled successfully!');
      } else {
        toast.error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      toast.error('Failed to verify 2FA');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copyAllCodes = () => {
    const allCodes = backupCodes.join('\n');
    navigator.clipboard.writeText(allCodes);
    toast.success('All codes copied to clipboard');
  };

  const downloadCodes = () => {
    const content = `Two-Factor Authentication Backup Codes
Generated: ${new Date().toLocaleString()}

IMPORTANT: Store these codes securely!
Each code can only be used once.

${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

If you lose access to your authenticator app, use these codes to log in.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  const finish = () => {
    navigate('/settings');
  };

  if (loading && !qrCode) {
    return <LoadingScreen message="Setting up two-factor authentication..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl text-center">
            {step === 1 && 'Set Up Two-Factor Authentication'}
            {step === 2 && 'Verify Your Setup'}
            {step === 3 && 'Save Your Backup Codes'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {step === 1 && 'Scan the QR code with your authenticator app'}
            {step === 2 && 'Enter the code from your authenticator app'}
            {step === 3 && 'Keep these codes safe - you\'ll need them if you lose your device'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: QR Code */}
          {step === 1 && (
            <>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <span className="font-medium">Scan QR</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    2
                  </div>
                  <span className="text-muted-foreground">Verify</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    3
                  </div>
                  <span className="text-muted-foreground">Backup</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-border">
                {qrCode && (
                  <div className="flex flex-col items-center space-y-4">
                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with Google Authenticator, Authy, or any TOTP app
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Or enter this code manually:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={manualKey}
                    readOnly
                    className="font-mono text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(manualKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this if you can't scan the QR code
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Recommended Apps:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Google Authenticator</li>
                      <li>Microsoft Authenticator</li>
                      <li>Authy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/settings')} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)} className="flex-1">
                  Next: Verify Code
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Scan QR</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="font-medium">Verify</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    3
                  </div>
                  <span className="text-muted-foreground">Backup</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <KeyRound className="h-16 w-16 mx-auto text-primary mb-4" />
                  <p className="text-muted-foreground">
                    Open your authenticator app and enter the 6-digit code
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-3xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    💡 The code changes every 30 seconds. Make sure you enter it before it expires.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={verify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {loading ? <Spinner size="sm" /> : 'Verify & Enable 2FA'}
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Scan QR</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2 opacity-50">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Verify</span>
                </div>
                <div className="h-px w-12 bg-border" />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="font-medium">Backup</span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                  Two-Factor Authentication Enabled!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Your account is now protected with 2FA
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Backup Codes</Label>
                  <Badge variant="warning" className="text-xs">
                    Save These Codes
                  </Badge>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700"
                      >
                        <span className="font-mono text-sm font-semibold">{code}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-900 dark:text-red-100">
                      <p className="font-semibold mb-1">⚠️ Important:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Each code can only be used once</li>
                        <li>Store them in a safe place (password manager recommended)</li>
                        <li>Use them if you lose access to your authenticator app</li>
                        <li>You won't be able to see these codes again</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={copyAllCodes} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" onClick={downloadCodes} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Button onClick={finish} className="w-full" size="lg">
                Finish Setup
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
