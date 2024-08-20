using UnityEngine;

public class WireConnection : MonoBehaviour
{
    public Transform positiveTerminal; 
    public Transform negativeTerminal;  
    public Transform ledPositivePin;    
    public Transform ledNegativePin;    

    private LineRenderer currentWire;   
    private bool isDrawing = false;     

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
           
            if (CheckForDrawingStart(positiveTerminal) || CheckForDrawingStart(negativeTerminal))
            {
                isDrawing = true;
            }
        }

        if (isDrawing)
        {
         
            Vector3 mousePosition = GetMouseWorldPosition();
            if (currentWire != null)
            {
                currentWire.SetPosition(1, mousePosition);
            }
        }

        if (Input.GetMouseButtonUp(0) && isDrawing)
        {
            
            StopDrawingWire(ledPositivePin, ledNegativePin);
            isDrawing = false;
        }
    }

    bool CheckForDrawingStart(Transform terminal)
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit) && hit.transform == terminal)
        {
            currentWire = CreateWire();
            currentWire.SetPosition(0, terminal.position);
            currentWire.SetPosition(1, terminal.position);
            return true;
        }
        return false;
    }

    void StopDrawingWire(Transform pin1, Transform pin2)
    {
        if (currentWire == null) return;

        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        if (Physics.Raycast(ray, out hit))
        {
            if (hit.transform == pin1 || hit.transform == pin2)
            {
           
                currentWire.SetPosition(1, hit.transform.position);
            }
            else
            {
            
                Destroy(currentWire.gameObject);
            }
        }
    }

    LineRenderer CreateWire()
    {
        GameObject wireObject = new GameObject("Wire");
        LineRenderer wire = wireObject.AddComponent<LineRenderer>();
        wire.startWidth = 0.02f;
        wire.endWidth = 0.02f;
        wire.positionCount = 2;
        wire.useWorldSpace = true;
        wire.material = new Material(Shader.Find("Sprites/Default"));
        return wire;
    }

    Vector3 GetMouseWorldPosition()
    {
        Vector3 mousePosition = Input.mousePosition;
        mousePosition.z = 10f;  
        return Camera.main.ScreenToWorldPoint(mousePosition);
    }
}
