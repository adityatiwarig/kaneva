// app/service/peer.ts

class PeerService {
  peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  async getOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    await this.peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(ans);
    return ans;
  }

  async setLocalDescription(
    ans: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.peer.setRemoteDescription(
      new RTCSessionDescription(ans)
    );
  }
}

// ✅ SSR-safe singleton
let peerInstance: PeerService | null = null;

export function getPeer(): PeerService | null {
  if (typeof window === "undefined") return null;

  if (!peerInstance) {
    peerInstance = new PeerService();
  }

  return peerInstance;
}
