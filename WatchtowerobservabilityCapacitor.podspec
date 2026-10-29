require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'WatchtowerobservabilityCapacitor'
  s.version = package['version']
  s.summary = package['description']
  s.license = 'Apache-2.0'
  s.homepage = 'https://github.com/watchtowerobservability/watchtower-capacitor'
  s.author = 'Watchtower'
  s.source = { :git => 'https://github.com/watchtowerobservability/watchtower-capacitor.git', :tag => "v#{s.version}" }
  s.source_files = 'ios/Sources/WatchtowerPlugin/**/*.{swift,h,m}'
  s.ios.deployment_target = '13.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.9'
end
