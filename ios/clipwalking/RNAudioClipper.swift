//
//  RNAudioClipper.swift
//  AppAudioClipper
//
//  Created by Tiago Stutz on 16/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AVFoundation

@objc(RNAudioClipper)
class RNAudioClipper: NSObject {
  
  
  @objc(clip:startClipPosition:stopClipPosition:callback:)
  public func clip(fileUrl: String, startClipPosition: NSNumber, stopClipPosition: NSNumber, callback: @escaping RCTResponseSenderBlock) -> Void {
    
    print("+++ >>> RECEIVED PARAMS: \(String(describing: fileUrl)), \(String(describing: startClipPosition)), \(stopClipPosition)")
    
    if let audioUrl = URL(string: fileUrl) {
      
      // to check if it exists before downloading it
      if FileManager.default.fileExists(atPath: audioUrl.path) {
//        let startClipPositionInt: Int64? = Int64(startClipPosition)
//        let stopClipPositionInt: Int64? = Int64(stopClipPosition)
        self.exportAsset(audioUrl, startClipPosition: (startClipPosition as! Int64), stopClipPosition:  (stopClipPosition as! Int64),completionHandler: { (successMessage: String, errorMessage: String) in
          callback([errorMessage, [
            "filePath": successMessage
            ]])
        })
        // if the file doesn't exist
      } else {
        
        // you can use NSURLSession.sharedSession to download the data asynchronously
        URLSession.shared.downloadTask(with: audioUrl, completionHandler: { (location, response, error) -> Void in
          guard let location = location, error == nil else { return }
          do {
            // after downloading your file you need to move it to your destination url
            try FileManager.default.moveItem(at: location, to: audioUrl)
            print("File moved to documents folder")
            let startClipPositionInt: Int64? = Int64(startClipPosition)
            let stopClipPositionInt: Int64? = Int64(stopClipPosition)
            self.exportAsset(audioUrl, startClipPosition:  startClipPositionInt, stopClipPosition:  stopClipPositionInt, completionHandler: { (successMessage: String, errorMessage: String) in
                    callback([errorMessage, [
                      "filePath": successMessage
                    ]])
              })
          } catch let error as NSError {
            print(error.localizedDescription)
          }
        }).resume()
      }
    }
  }
  
  func exportAsset(_ audioUrl: URL, startClipPosition: Int64?, stopClipPosition: Int64?, completionHandler: @escaping (String, String) -> Void) {
    
    let asset = AVAsset(url: audioUrl)
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    let trimmedSoundFileURL = documentsDirectory.appendingPathComponent("clip-\(ProcessInfo.processInfo.globallyUniqueString).m4a")
    
    print("+++ saving to \(trimmedSoundFileURL.absoluteString)")
    
    if FileManager.default.fileExists(atPath: trimmedSoundFileURL.absoluteString) {
      print("clip already exists, removing \(trimmedSoundFileURL.absoluteString)")
      do {
        if try trimmedSoundFileURL.checkResourceIsReachable() {
          print("is reachable")
        }
        
        try FileManager.default.removeItem(atPath: trimmedSoundFileURL.absoluteString)
      } catch {
        print("could not remove \(trimmedSoundFileURL)")
        print(error.localizedDescription)
      }
      
    }
    
    print("+++ creating export session for \(asset)")
    
    if let exporter = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetAppleM4A) {
      exporter.outputFileType = AVFileType.m4a
      exporter.outputURL = trimmedSoundFileURL
      print(trimmedSoundFileURL)
      let duration = CMTimeGetSeconds(asset.duration)
      print("+++ duration: \(duration)")
      if duration < 5.0 {
        print("+++ sound is not long enough")
        return
      }
      
      let startTime = CMTimeMake(value: startClipPosition!, timescale:1)
      let stopTime = CMTimeMake(value: stopClipPosition!, timescale:1)
      print("+++ duration: \(startTime) <> \(stopTime)")
      exporter.timeRange = CMTimeRangeFromTimeToTime(start:startTime, end:stopTime)
      
      // do it
      exporter.exportAsynchronously(completionHandler: {
        print("+++ export complete \(exporter.status)")
        
        switch exporter.status {
        case  AVAssetExportSession.Status.failed:
          
          if let e = exporter.error {
            print("+++ export failed \(e)")
            completionHandler("", "export failed \(e)")
          }
          
        case AVAssetExportSession.Status.cancelled:
          print("+++ export cancelled \(String(describing: exporter.error))")
          completionHandler("", "export canceled")
        default:
          print("+++ export complete")
          completionHandler(trimmedSoundFileURL.path, "")
        }
      })
    } else {
      print("+++ cannot create AVAssetExportSession for asset \(asset)")
    }
    
  }
  
  
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
}

