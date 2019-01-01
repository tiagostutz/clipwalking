//
//  RNAudioClipper.m
//  AppAudioClipper
//
//  Created by Tiago Stutz on 16/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNAudioClipperBridge.h"

@interface RCT_EXTERN_REMAP_MODULE(AudioClipper, RNAudioClipper, NSObject)

RCT_EXTERN_METHOD(clip:(NSString*)fileUrl
                  startClipPosition:(nonnull NSNumber)startClipPosition
                  stopClipPosition:(nonnull NSNumber)stopClipPosition
                  callback:(RCTResponseSenderBlock)callback)


@end
