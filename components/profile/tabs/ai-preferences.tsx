import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function AIPreferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis Preferences</CardTitle>
        <CardDescription>Configure how AI analyzes your compliance documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Analysis Depth</Label>
            <RadioGroup defaultValue="balanced">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick" id="quick" />
                  <Label htmlFor="quick">Quick Scan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced">Balanced</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="thorough" id="thorough" />
                  <Label htmlFor="thorough">Thorough</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Risk Tolerance</Label>
            <Select defaultValue="moderate">
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select defaultValue="realtime">
              <SelectTrigger>
                <SelectValue placeholder="Select notification frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Additional Features</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automated Document Classification</Label>
                  <p className="text-sm text-muted-foreground">Let AI categorize uploaded documents automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Predictive Analytics</Label>
                  <p className="text-sm text-muted-foreground">Use AI to predict potential compliance issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Historical Analysis</Label>
                  <p className="text-sm text-muted-foreground">Compare current documents with historical data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}

