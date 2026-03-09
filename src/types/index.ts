export type MediaType = 'video' | 'audio' | 'image';

export interface MediaAsset {
	  id: string;
	    uri: string;
	      type: MediaType;
	        name: string;
	          duration: number; // in milliseconds
	            width?: number;
	              height?: number;
	              }

	              export interface Keyframe {
	              	  time: number; // ms from clip start
	              	    value: number;
	              	    }

	              	    export interface ClipTransform {
	              	    	  x: number;
	              	    	    y: number;
	              	    	      scaleX: number;
	              	    	        scaleY: number;
	              	    	          rotation: number;
	              	    	            opacity: number;
	              	    	            }

	              	    	            export interface Clip {
	              	    	            	  id: string;
	              	    	            	    assetId: string;
	              	    	            	      trackId: string;
	              	    	            	        startTime: number;   // position on timeline in ms
	              	    	            	          duration: number;    // how long it plays in ms
	              	    	            	            trimStart: number;   // trim from start of asset in ms
	              	    	            	              trimEnd: number;     // trim from end of asset in ms
	              	    	            	                transform: ClipTransform;
	              	    	            	                  volume: number;      // 0 to 1
	              	    	            	                    speed: number;       // 1 = normal, 0.5 = half speed
	              	    	            	                      keyframes: {
	              	    	            	                      	    opacity?: Keyframe[];
	              	    	            	                      	        volume?: Keyframe[];
	              	    	            	                      	            x?: Keyframe[];
	              	    	            	                      	                y?: Keyframe[];
	              	    	            	                      	                    scaleX?: Keyframe[];
	              	    	            	                      	                        scaleY?: Keyframe[];
	              	    	            	                      	                          };
	              	    	            	                      	                          }

	              	    	            	                      	                          export type TrackType = 'video' | 'audio' | 'overlay';

	              	    	            	                      	                          export interface Track {
	              	    	            	                      	                          	  id: string;
	              	    	            	                      	                          	    type: TrackType;
	              	    	            	                      	                          	      name: string;
	              	    	            	                      	                          	        clips: Clip[];
	              	    	            	                      	                          	          muted: boolean;
	              	    	            	                      	                          	            locked: boolean;
	              	    	            	                      	                          	              volume: number;
	              	    	            	                      	                          	              }

	              	    	            	                      	                          	              export interface Project {
	              	    	            	                      	                          	              	  id: string;
	              	    	            	                      	                          	              	    name: string;
	              	    	            	                      	                          	              	      createdAt: number;
	              	    	            	                      	                          	              	        updatedAt: number;
	              	    	            	                      	                          	              	          duration: number;       // total timeline duration in ms
	              	    	            	                      	                          	              	            fps: number;            // frames per second
	              	    	            	                      	                          	              	              width: number;          // canvas width
	              	    	            	                      	                          	              	                height: number;         // canvas height
	              	    	            	                      	                          	              	                  tracks: Track[];
	              	    	            	                      	                          	              	                    assets: MediaAsset[];
	              	    	            	                      	                          	              	                    }

	              	    	            	                      	                          	              	                    export interface ExportSettings {
	              	    	            	                      	                          	              	                    	  resolution: '480p' | '720p' | '1080p' | '4K';
	              	    	            	                      	                          	              	                    	    fps: 24 | 30 | 60;
	              	    	            	                      	                          	              	                    	      format: 'mp4' | 'webm';
	              	    	            	                      	                          	              	                    	        quality: 'low' | 'medium' | 'high';
	              	    	            	                      	                          	              	                    	        }
	              	    	            	                      	                          	              	                    }
	              	    	            	                      	                          	              }
	              	    	            	                      	                          }
	              	    	            	                      }
	              	    	            }
	              	    }
	              }
}
